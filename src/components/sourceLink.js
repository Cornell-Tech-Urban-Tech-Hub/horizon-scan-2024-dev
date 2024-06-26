import React from "react"
// import PropTypes from "prop-types"
import styled from "styled-components"
import getHostName from "../utilities/getHostName"

const StyledSourceLink = styled.a`
  font-family: ${({ theme }) => theme.type.sans};
  font-size: 0.9rem;

  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5em;
  background-color: lightgrey;
  transition: all 0.5s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    /* opacity: 0.7; */
    background-color: ${props => props.theme.colors.primary};
    color: #fff;
  }
`

export const SourceLink = ({ url }) => {
  let host = url ? getHostName(url) : null // returns youtube.com
  return (
    <StyledSourceLink href={url} target="_blank" rel="noreferrer">
      Source: <span className="host">{host}</span>
    </StyledSourceLink>
  )
}
