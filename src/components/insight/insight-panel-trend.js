import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
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
import { lighten } from "polished";
import { above, below } from "../../styles/utilities/breakpoints";

const OptionsPanel = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  //background: #efefef;
  background: #ffffff;
  background-color: ${(props) => lighten(0.5, props.theme.colors.primary)};
  h3 {
    margin: 0;
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    ${above.lg} {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .options-button {
    margin-top: 1rem;
    display: flex;
    align-items: stretch;
  }
`;

const ResultsPanel = styled.div`
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background: #efefef;
  padding: 1rem;
  border: 1px solid #ccc;
`;

const StyledInsightResult = styled.div`
  margin-top: 1rem;
  border-radius: 0.5rem;

  .insight-set {
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    ${above.lg} {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .meta {
    margin-top: 1rem;
    color: #777;
    font-size: 0.85rem;
  }
`;

const StyledInsightCard = styled.div`
  padding: 1rem;
  background: #fff;
  border-left: 4px solid ${(props) => props.theme.colors.primary};
  h4 {
    margin-top: 0;
    font-size: 1.2rem;
    line-height: 1.4;
    color: #fff;
    span {
      background-color: ${(props) => props.theme.colors.primary};
      box-shadow:
        1rem 0 0 ${(props) => props.theme.colors.primary},
        -1rem 0 0 ${(props) => props.theme.colors.primary};
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
  }
  .insight-header {
    ${above.lg} {
      min-height: 4rem;
    }
  }

  .insight-inner {
    font-size: 0.85rem;
  }
`;

const StyledErrorMessage = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

const optionsSector = generatorOptions.sectors.values.map((d) => {
  let value = d;
  let label = d;
  return { value, label };
});

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

export const InsightPanel = ({ trend, title, html }) => {
  // const sectorQuery = useStaticQuery(graphql`
  //   query {
  //     allAirtable(filter: { table: { eq: "Signals" } }) {
  //       distinct(field: { data: { Sector: SELECT } })
  //     }
  //   }
  // `);
  // console.log(sectorQuery);

  //const optionsSector = sectorQuery?.data?.allAirtable?.sectors.distinct;

  //const [selectedSector, setSector] = React.useState(optionsSector[0].value);

  const [selectedSector, setSector] = React.useState(
    generatorOptions.sectors.values[0]
  );
  const [selectedOccupation, setOccupation] = React.useState(
    generatorOptions.occupations.values[0]
  );
  const [errorMessage, setErrorMessage] = React.useState(null);
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
      if (errorMessage !== null) {
        setErrorMessage(null);
      }

      if (results.status === "ok") {
        results.id = insights.length + 1;
        setInsights([results, ...insights]);
      } else {
        setErrorMessage("Error Accessing Insight Generator");
      }
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
      <Content>
        <Row>
          <Col>
            <h2>{title}</h2>
          </Col>
        </Row>
        <Row>
          <Col size={1}>
            <div
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </Col>
          <Col size={2}>
            <OptionsPanel>
              <h3>Generator Settings</h3>
              <div className="options-grid">
                <FormSelect
                  id={"sector"}
                  label={"Sector"}
                  value={selectedSector}
                  onChange={(e) => updateSector(e.target.value)}
                  options={optionsSector}
                />
                <FormSelect
                  id={"occupation"}
                  label={"Occupation"}
                  value={selectedOccupation}
                  onChange={(e) => updateOccupation(e.target.value)}
                  options={optionsOccupation}
                />
                <FormSelect
                  id={"timeframe"}
                  label={"Timeframe"}
                  value={selectedTimeframe}
                  onChange={(e) => updateTimeframe(e.target.value)}
                  options={optionsTimeframe}
                />
              </div>

              <div className="options-button">
                <ButtonGenerator
                  className="generate-button"
                  onClick={() => getInsights()}
                >
                  {"Generate Insights"}
                </ButtonGenerator>
              </div>
            </OptionsPanel>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading && (
              <Loading>
                <LoadingIcon message={"Generating Insights"} />
              </Loading>
            )}
            {errorMessage && (
              <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
            )}
            {!loading && insights.length > 0 && (
              <ResultsPanel>
                <Row>
                  <Col>
                    <h3>Insights</h3>
                  </Col>
                </Row>
                <InsightResult key={1} result={insights[0]} showMeta={true} />
              </ResultsPanel>
            )}
            {/* {insights.length > 1 && (
        <>
          <h3>Previous Requests</h3>
          {insights.map(
            (insight, i) =>
              i > 0 && <InsightCardSynthesis key={i + 1} result={insight} />
          )}
        </>
      )} */}
          </Col>
        </Row>
      </Content>
    </>
  );
};

export const InsightResult = ({ result, showMeta = false }) => {
  let trend = result.settings.body.trend;
  let settings = result.settings.body.generator_settings;

  return (
    <StyledInsightResult>
      <div className="insight-set">
        {result.insights?.map((insight, i) => (
          <InsightCard insight={insight}>
            <h4>{insight.title}</h4>
            <div className="insight-inner">
              <p>{insight.synthesis}</p>
            </div>
          </InsightCard>
        ))}
      </div>
      {showMeta && (
        <div className="meta">
          <Col>
            Request ({result.id}): {result.timestamp}
            {/* / Time: {result.time} */}
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
      )}
    </StyledInsightResult>
  );
};

export const InsightCard = ({ insight }) => {
  return (
    <StyledInsightCard>
      <div className="insight-header">
        <h4>
          <span>{insight.title}</span>
        </h4>
      </div>
      <div className="insight-inner">
        <p>{insight.synthesis}</p>
      </div>
    </StyledInsightCard>
  );
};
