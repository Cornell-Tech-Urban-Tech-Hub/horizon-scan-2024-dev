import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { ButtonMore } from "./button"

const { slugFormat } = require("../utilities/slugFormat")

const Wrapper = styled.div`
  margin-bottom: 3rem;
`

const SyledShowOutline = styled.div`
  .collapse-button {
    display: block;
  }

  .collapse-content {
    transition: visibility 0s, opacity 0.5s linear;
  }

  .collapse-content.collapsed {
    display: none;
  }

  .collapsed-content.expanded {
    display: block;
  }
`

export function FilteredOutline({ forecasts, ids }) {
  return (
    <Wrapper>
      <h2>Outline View</h2>
      <p>
        View a text outline of the complete network or filtered view of
        hightlight sectors or tags
      </p>
      <ShowOutline>
        {forecasts.nodes
          .filter(d => ids.includes(d.recordId))
          .map(node => (
            <div key={node.recordId}>
              <h3>
                Forecast:{" "}
                <Link to={`/forecasts/${slugFormat(node.data.Name)}`}>
                  {node.data.Name}
                </Link>
              </h3>
              <ul>
                {node.data.Trends?.filter(d => ids.includes(d.recordId)).map(
                  trend => (
                    <li key={trend.recordId}>
                      <strong>
                        Trend:{" "}
                        <Link to={`/trends/${slugFormat(trend.data.Name)}`}>
                          {trend.data.Name}
                        </Link>
                      </strong>
                      <ListFilteredSignals
                        signals={trend.data.Signals}
                        ids={ids}
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
      </ShowOutline>
    </Wrapper>
  )
}

function ListFilteredSignals({ signals, ids }) {
  let filteredSignals = signals.filter(d => ids.includes(d.recordId))

  return (
    <>
      {filteredSignals.length > 0 && (
        <div>
          {"Signals: "}
          {filteredSignals.map((signal, i) => {
            let divider = i < filteredSignals.length - 1 && <>{", "}</>
            return (
              <span key={signal.recordId}>
                <Link to={`/signals/${slugFormat(signal.data.Name)}`}>
                  {signal.data.Name}
                </Link>
                {divider}
              </span>
            )
          })}
        </div>
      )}
    </>
  )
}

const ShowOutline = ({ expanded = false, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded)

  return (
    <SyledShowOutline>
      <ButtonMore
        isExpanded={isExpanded}
        openText={"Show"}
        closeText={"Close"}
        className="collapse-button"
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <div
        className={`collapse-content ${isExpanded ? "expanded" : "collapsed"}`}
        aria-expanded={isExpanded}
      >
        {children}
      </div>
    </SyledShowOutline>
  )
}
