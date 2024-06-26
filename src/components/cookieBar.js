import React from "react"
import styled from "styled-components"
import { below } from "../styles/utilities/breakpoints"
import CookieConsent from "react-cookie-consent"
import { useLocation } from "@reach/router"
import { initializeAndTrack } from "gatsby-plugin-gdpr-cookies"

import { Content } from "../styles/StyledElements"

const StyledCookieBar = styled.div`
  position: fixed;
  left: 0;
  bottom: 1rem;
  width: 100%;
  margin: 0;
  z-index: 999;
  font-family: ${({ theme }) => theme.type.sans};

  .CookieConsent {
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 1rem;
    ${below.tablet} {
      flex-direction: column;
    }
  }

  .cookieMessage {
    margin: 0;
    ${below.tablet} {
      margin-bottom: 1rem;
    }
  }

  .CookieConsent button {
    outline: none;
    width: 7rem;
    background-color: #555;
    border: none;
    color: #fff;
    padding: 0.5rem;
    margin: 0 1rem 0 0;
    font-size: 0.875rem;
    font-weight: 700;
    border-radius: 0.5rem;
    text-decoration: none;
    text-align: center;
    &:hover,
    &:focus,
    &:active {
      cursor: pointer;
      outline: none;
    }
  }
  .CookieConsent button#confirm {
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;

    margin: 0;
  }
`

const CookieBar = () => {
  const location = useLocation()
  // console.log("Bar location")
  // console.log(location)
  // if (!isIntroDone) return null

  return (
    <StyledCookieBar>
      <Content>
        <CookieConsent
          cookieName="gatsby-gdpr-google-analytics"
          buttonId="confirm"
          buttonText="OK"
          // declineButtonId="decline"
          // declineButtonText="Decline"
          // enableDeclineButton={false}
          disableStyles={true}
          onAccept={() => initializeAndTrack(location)}
        >
          <p className="cookieMessage">
            This website uses cookies to improve your experience.
          </p>
        </CookieConsent>
      </Content>
    </StyledCookieBar>
  )
}

export default CookieBar
