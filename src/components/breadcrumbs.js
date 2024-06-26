import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { Row, Col } from "../styles/StyledElements";
import { processTree } from "./viz/processNetworkV4";
import { lighten } from "polished";
import { below } from "../styles/utilities/breakpoints";

const { slugFormat } = require("../utilities/slugFormat");

const StyledBreadcrumbs = styled.div`
  background: #222;
  padding: 1rem 0;

  .inner {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    color: #bbb;
  }
  /* display: grid; */
  // grid-template-columns: 3fr 1fr;
  // grid-gap: 40px
  .content-tag {
    font-family: ${({ theme }) => theme.type.sans};
    font-size: 1.4rem;
    line-height: 1.2;
    ${below.md} {
      font-size: 1.2rem;
    }
  }
  h4 {
    font-size: 0.8rem;
    color: #aaa;
    margin: 0;
  }

  a:link,
  a:visited {
    font-family: ${({ theme }) => theme.type.sans};
    font-size: 0.9rem;
    line-height: 1;
    text-decoration: none;
    color: ${(props) => lighten(0.4, props.theme.colors.link)};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ColCrumbs = styled.div`
  position: relative;
  /* padding-left: 1rem;
  padding-right: 1rem; */
  display: flex;
  flex: ${(props) => (props.size ? props.size : 1)};
  flex-direction: column;
  ${below.md} {
    padding-top: 1rem;
  }
`;

const Breadcrumbs = ({ type, node }) => {
  let tree = processTree(node, type);
  // console.log(tree)

  return (
    <StyledBreadcrumbs>
      <div className={"inner"}>
        {type === "forecast" && (
          <Row>
            <Col size={1}>
              <div className="content-tag">
                {`FORECAST | ${node.data.Category_Header}`}
              </div>
            </Col>
          </Row>
        )}
        {type === "trend" && (
          <Row>
            <Col size={1} fixedSize={true}>
              <div className="content-tag">{`TREND`}</div>
            </Col>
            <ColCrumbs size={1}>
              <Row collapse={"none"}>
                <Col size={1}>
                  <h4>
                    {tree.forecasts.length > 1 ? "Forecasts" : "Forecast"}
                  </h4>
                  {tree.forecasts?.map((node) => (
                    <div key={node.id}>
                      <Link to={`/forecasts/${slugFormat(node.name)}`}>
                        {node.name}
                      </Link>
                    </div>
                  ))}
                </Col>
              </Row>
            </ColCrumbs>
            <Col size={1}></Col>
          </Row>
        )}
        {type === "signal" && (
          <Row>
            <Col size={1}>
              <div className="content-tag">{`SIGNAL`}</div>
            </Col>
            <ColCrumbs size={2} outer={true}>
              <Row collapse={"none"}>
                <Col size={1}>
                  <h4>{tree.trends.length > 1 ? "Trends" : "Trend"}</h4>
                  {tree.trends?.map((node) => (
                    <l key={node.recordId}>
                      <Link to={`/trends/${slugFormat(node.name)}`}>
                        {node.name}
                      </Link>
                    </l>
                  ))}
                </Col>
                <Col size={1}>
                  <h4>
                    {tree.forecasts.length > 1 ? "Forecasts" : "Forecast"}
                  </h4>
                  {tree.forecasts?.map((node) => (
                    <div key={node.id}>
                      <Link to={`/forecasts/${slugFormat(node.name)}`}>
                        {node.name}
                      </Link>
                    </div>
                  ))}
                </Col>
              </Row>
            </ColCrumbs>
          </Row>
          // <Row>
          //   <Col size={1}>
          //     <div className="content-tag">{`SIGNAL`}</div>
          //   </Col>
          //   <Col size={1}>
          //     <h4>{tree.trends.length > 1 ? "Trends" : "Trend"}</h4>
          //     {tree.trends?.map(node => (
          //       <l key={node.recordId}>
          //         <Link to={`/trends/${slugFormat(node.name)}`}>
          //           {node.name}
          //         </Link>
          //       </l>
          //     ))}
          //   </Col>
          //   <Col size={1}>
          //     <h4>{tree.forecasts.length > 1 ? "Forecasts" : "Forecast"}</h4>
          //     {tree.forecasts?.map(node => (
          //       <div key={node.id}>
          //         <Link to={`/forecasts/${slugFormat(node.name)}`}>
          //           {node.name}
          //         </Link>
          //       </div>
          //     ))}
          //   </Col>
          // </Row>
        )}
      </div>
    </StyledBreadcrumbs>
  );
};

export default Breadcrumbs;
