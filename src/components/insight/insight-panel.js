import React, { useState } from "react";
// import PropTypes from "prop-types"
import styled from "styled-components";
//import { below } from "../styles/utilities/breakpoints"
import { FormSelect } from "../formSelect";
import { ButtonGenerator } from "../button";
import { Section, Content, Row, Col } from "../../styles/StyledElements";
import { generateInsight } from "./generateInsight";
// import sampleInsights from "../../content/sample-insights.json";
import generatorOptions from "../../content/generator-options.json";
import { LoadingIcon } from "./loadingIcon";

const OptionsPanel = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  background: #efefef;
  h3 {
    margin: 0;
  }
`;

const ResultsPanel = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  background: #efefef;
`;

const StyledInsightCard = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  background: #efefef;

  .insight-inner {
    font-size: 0.85rem;
  }

  .meta {
    color: #777;
    font-size: 0.85rem;
  }
`;

const Loading = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const optionsSector = [{ value: "Transportation", label: "Transportation" }];
// const optionsOccupation = [{ value: "Urban Planner", label: "Urban Planner" }];
// const optionsTimeframe = [
//   { value: 2029, label: 2029 },
//   { value: 2030, label: 2030 },
//   { value: 2031, label: 2031 },
//   { value: 2032, label: 2032 },
// ];

const optionsOccupation = generatorOptions.occupations.values.map((d) => {
  let value = d;
  let label = d;
  return { value, label };
});
const optionsTimeframe = generatorOptions.timeframes.values.map((d) => {
  let value = d;
  let label = d;
  return { value, label };
});

export const InsightPanel = ({ trend, optionsSector }) => {
  const [selectedSector, setSector] = React.useState(optionsSector[0].value);
  const [selectedOccupation, setOccupation] = React.useState(
    generatorOptions.occupations.values[0]
  );
  const [selectedTimeframe, setTimeframe] = React.useState(
    generatorOptions.timeframes.values[0]
  );

  const [insights, setInsights] = React.useState([]);

  // console.log("InsightPanel");
  // console.log(trend);

  const [loading, setLoading] = React.useState(false);

  function updateSector(value) {
    setSector(value);
  }
  function updateOccupation(value) {
    setOccupation(value);
  }
  function updateTimeframe(value) {
    setTimeframe(value);
  }

  function getInsights() {
    const settings = {
      sector: selectedSector,
      occupation: selectedOccupation,
      timeframe: selectedTimeframe,
    };
    // console.log(`getInsights`);

    setLoading(true);

    generateInsight(trend.data, settings).then((results) => {
      // console.log("callback");
      // console.log(results);
      results.id = insights.length + 1;
      setInsights([results, ...insights]);
      setLoading(false);
    });

    // setTimeout(() => {
    //   setInsights(sampleInsights.insights);
    // }, "5000");
    // generateInsight(trend.data, settings, (insight) => {
    //   console.log(insight);
    // });
  }

  // function updateInsightSelections() {
  //   let request = {};
  //   console.log("updateInsightSelections");
  // }
  // console.log(sampleInsights);

  return (
    <>
      <OptionsPanel>
        <Row>
          <Col>
            <h3>Options</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormSelect
              id={"sector"}
              label={"Sector"}
              value={selectedSector}
              onChange={(e) => updateSector(e.target.value)}
              options={optionsSector}
            />
          </Col>
          <Col>
            <FormSelect
              id={"occupation"}
              label={"Occupation"}
              value={selectedOccupation}
              onChange={(e) => updateOccupation(e.target.value)}
              options={optionsOccupation}
            />
          </Col>
          <Col>
            <FormSelect
              id={"timeframe"}
              label={"Timeframe"}
              value={selectedTimeframe}
              onChange={(e) => updateTimeframe(e.target.value)}
              options={optionsTimeframe}
            />
          </Col>
        </Row>
      </OptionsPanel>
      <ButtonGenerator
        className="generate-button"
        onClick={() => getInsights()}
      >
        {"Get Insights"}
      </ButtonGenerator>
      {loading && (
        <Loading>
          <LoadingIcon message={"Generating Insights"} />
        </Loading>
      )}
      {insights.length > 0 && (
        <>
          <InsightCard key={1} result={insights[0]} />
        </>
      )}
      {insights.length > 1 && (
        <>
          <h3>Previous Requests</h3>
          {insights.map(
            (insight, i) =>
              i > 0 && <InsightCard key={i + 1} result={insight} />
          )}
        </>
      )}
    </>
  );
};

export const InsightCard = ({ result }) => {
  let trend = result.settings.body.trend;
  let settings = result.settings.body.generator_settings;

  return (
    <StyledInsightCard>
      <div className="insight-set">
        <Row>
          {result.insights?.map((insight, i) => (
            <Col>
              <div className="insight">
                <h3>{insight.title}</h3>
                <div className="insight-inner">
                  <p>
                    <strong>Challenges:</strong> {insight.challenges}
                  </p>
                  <p>
                    <strong>Innovative Applications:</strong>{" "}
                    {insight.innovative_applications}
                  </p>
                  <p>
                    <strong>Opportunities:</strong> {insight.opportunities}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div className="meta">
          <Col>
            Request ({result.id}): {result.timestamp} / Time: {result.time}
            <div>
              Trend: <strong>{trend.title}</strong>
            </div>
            <div>
              Sector: <strong>{settings.sector}</strong> / Occupation:{" "}
              <strong>{settings.occupation}</strong> / Time frame:{" "}
              <strong>{settings.time_frame}</strong>
            </div>
          </Col>
        </div>
      </div>
    </StyledInsightCard>
  );
};
