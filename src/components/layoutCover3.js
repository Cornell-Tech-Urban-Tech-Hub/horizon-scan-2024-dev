import React, { useEffect } from "react";
import styled from "styled-components";
import { Waypoint } from "react-waypoint";
import { Link } from "gatsby";
import cornellLogo from "../assets/vertical-jacobs-cornell-dark.svg";
import { above, below } from "../styles/utilities/breakpoints";
import { NetworkBuild4 } from "./viz/networkBuild4-cover";
import {
  Section,
  SectionCrop,
  Content,
  Row,
  Col,
} from "../styles/StyledElements";

const IntroWrapper = styled.div`
  ${below.md} {
  }

  .title {
    margin-top: 1rem;
    z-index: 100;
    /* padding: 1rem; */
    pointer-events: none;
    padding-left: 10px;
    padding-right: 10px;

    h1 {
      font-size: 3rem;
      line-height: 1.2;
      ${below.md} {
        font-size: 2.4rem;
      }
      margin-bottom: 0.25rem;
      span {
        background-color: white;
        box-shadow:
          10px 0 0 white,
          -10px 0 0 white;
        box-decoration-break: clone;
      }
    }

    ${below.md} {
      margin-top: 0rem;
    }

    .subtitle {
      font-family: ${({ theme }) => theme.type.serif_alt};
      display: inline-block;
      font-size: 1.5rem;
      background-color: white;
      box-shadow:
        10px 0 0 white,
        -10px 0 0 white;
      margin-bottom: 2rem;
    }
  }
`;

export const LayoutCover = ({ site, dataset, mdNode }) => {
  return (
    <IntroWrapper>
      <Content>
        <Row>
          <Col>
            <div className="title">
              <h1>
                <span>{site.siteMetadata?.title}</span>
              </h1>
              <div className="subtitle">{site.siteMetadata?.subtitle}</div>
            </div>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <div className="intro">
              <div
                dangerouslySetInnerHTML={{
                  __html: mdNode?.html,
                }}
              />
              <Link to={`/introduction`} title={"Read the Introduction"}>
                {mdNode?.frontmatter.link_text}
              </Link>
            </div>
          </Col>
        </Row>
      </Content>
    </IntroWrapper>
  );
};
