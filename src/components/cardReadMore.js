import React from "react"
import styled from "styled-components"

const ReadMoreBlock = styled.div`
  .collapse-button {
    font-weight: bold;
    font-family: "din-2014", sans-serif;
    position: relative;
    width: 50%;
    color: grey;
    border-bottom: 1px solid grey;
  }

  .arrow {
    width: 30px;
    height: 20px;
    display: inline-block;
    /* vertical-align: top; */
    position: absolute;

    top: 0;
    right: 0;

    &:before,
    &:after {
      content: "";
      display: inline-block;
      height: 20px;
      width: 4px;
      background-color: grey;
      border-radius: 2px;
      position: relative;
      transition: 300ms ease-in-out transform;
    }

    &:before {
      transform: rotate(-45deg);
      left: 7px;
      top: 3px;
    }

    &:after {
      transform: rotate(45deg);
      left: 15px;
      top: 3px;
    }

    &.close {
      &:before {
        transform: translateX(6px) rotate(-45deg);
      }
      &:after {
        transform: translateX(-6px) rotate(45deg);
      }
    }
  }

  .collapse-content {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-top: 0.5rem;
    padding: 6px;
    margin-bottom: 0.5rem;
    background-color: #f5f5f5;
    /* border: 1px solid #e3e3e3; */
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 5%);
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

const CardReadMore = ({ collapsed = true, children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  return (
    <ReadMoreBlock>
      <div
        className={`collapse-button ${isCollapsed ? "open" : "close"}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={`arrow  ${isCollapsed ? "open" : "close"}`} />
        {isCollapsed ? "Read More" : "Close"}
      </div>
      <div
        className={`collapse-content ${isCollapsed ? "collapsed" : "expanded"}`}
        aria-expanded={isCollapsed}
      >
        {children}
      </div>
    </ReadMoreBlock>
  )
}

export default CardReadMore
