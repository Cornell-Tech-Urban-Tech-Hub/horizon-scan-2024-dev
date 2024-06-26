import React from "react"
// import PropTypes from "prop-types"
import styled from "styled-components"
//import { below } from "../styles/utilities/breakpoints"

const StyledButton = styled.button`
  font-family: ${({ theme }) => theme.type.sans};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem 0.5rem 0;
  font-weight: 700;
  border: none;
  border-radius: ${({ theme }) => theme.layout.borderRadius};
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    cursor: pointer;
    outline: none;
  }
  svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.3rem;
    margin-bottom: -0.175rem;
  }
`

const StyledButtonToggleMore = styled(StyledButton)`
  position: relative;
  text-align: left;
  min-width: 14rem;
  padding-right: 3rem;

  .arrow {
    width: 30px;
    height: 20px;
    display: inline-block;
    /* vertical-align: top; */
    position: absolute;

    top: 0.3rem;
    right: 0.5rem;

    &:before,
    &:after {
      content: "";
      display: inline-block;
      height: 20px;
      width: 4px;
      background-color: #fff;
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

export const Button = ({ onClick, children }) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
)

export const ButtonMore = ({
  onClick,
  children,
  isExpanded,
  openText,
  closeText,
}) => (
  <StyledButtonToggleMore onClick={onClick}>
    {isExpanded ? closeText : openText}
    <span className={`arrow  ${isExpanded ? "close" : "open"}`} />
  </StyledButtonToggleMore>
)

// Button.propTypes = {
//   onClick: PropTypes.func,
//   textAlign: PropTypes.string,
//   center: PropTypes.bool,
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]).isRequired,
// }
