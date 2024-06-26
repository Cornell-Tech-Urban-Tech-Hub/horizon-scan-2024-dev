import React from "react"
import styled from "styled-components"

const ReadMoreBlock = styled.div`
  .collapse-button {
    display: block;
    width: 100%;
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

const ReadMore = ({ collapsed = true, children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  return (
    <ReadMoreBlock>
      <button
        className="collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? "Read More" : "Close"}
      </button>
      <div
        className={`collapse-content ${isCollapsed ? "collapsed" : "expanded"}`}
        aria-expanded={isCollapsed}
      >
        {children}
      </div>
    </ReadMoreBlock>
  )
}

export default ReadMore
