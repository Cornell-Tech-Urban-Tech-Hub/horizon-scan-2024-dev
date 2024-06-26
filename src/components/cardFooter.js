import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const Options = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  font-family: ${props => props.theme.type.sans};
  font-weight: bold;

  .collapse-button {
    position: relative;
    color: grey;
    border-bottom: 1px solid grey;
  }

  .link-button {
    text-decoration: none;
    grid-column-start: 2;
    color: ${props => props.theme.colors.link};
    text-align: right;
    position: relative;
    border-bottom: 1px solid ${props => props.theme.colors.link};
    transition: 0.5s ease-in-out all;

    :after {
      content: " »";
      opacity: 0;
      top: 7px;
      transition: 0.5s;
    }

    &:hover {
      padding-right: 1rem;
      &:after {
        opacity: 1;
      }
    }
  }

  .link-button,
  .collapse-button {
    transition: 0.5s ease-in-out all;
    &:hover {
      background-color: rgba(255, 255, 255, 0.7);
    }
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
`

const StyledCardFooter = styled.div`
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

const CardFooter = ({
  readmore,
  link,
  linkText,
  collapsed = true,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  return (
    <StyledCardFooter>
      <Options>
        {readmore && (
          <div
            role={"button"}
            className={`collapse-button ${isCollapsed ? "open" : "close"}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span className={`arrow  ${isCollapsed ? "open" : "close"}`} />
            {isCollapsed ? "Read More" : "Close"}
          </div>
        )}

        <Link className="link-button" to={link}>
          {linkText}
        </Link>
      </Options>
      {readmore && (
        <div
          className={`collapse-content ${
            isCollapsed ? "collapsed" : "expanded"
          }`}
          aria-expanded={isCollapsed}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: readmore.childMarkdownRemark.html,
            }}
          />
        </div>
      )}
    </StyledCardFooter>
  )
}

export default CardFooter
