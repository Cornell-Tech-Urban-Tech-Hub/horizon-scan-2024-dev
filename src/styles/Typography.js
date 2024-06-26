import { createGlobalStyle } from "styled-components"
import { above, below } from "./utilities/breakpoints"

// import font from '../assets/fonts/frenchfries.woff';

const Typography = createGlobalStyle`

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    font-size: 100%;
    line-height: 1.6; 
    /* font-family: georgia, serif, sans-serif; */
    ${above.lg} {
      font-size: 112.5%
    }

  }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: hsla(0, 0%, 0%, 0.8);
    font-family: georgia, serif;
    font-weight: normal;
    word-wrap: break-word;
    font-kerning: normal;
    -moz-font-feature-settings: "kern", "liga", "clig", "calt";
    -ms-font-feature-settings: "kern", "liga", "clig", "calt";
    -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
    font-feature-settings: "kern", "liga", "clig", "calt";
  }

  p, li {

  }
  h1,h2,h3,h4,h5,h6 {
    font-family: "din-2014", sans-serif;

  }

  h1 {
    font-size: 2.4rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  h4,h5,h6 {
    margin-top: 1.5rem;
    margin-bottom: .75rem;  
  }

  a {


  }

  blockquote.statement {
    font-family: ${({ theme }) => theme.type.serif_alt};
    margin-top: 0;
    margin-left: 0;
    font-size: 2rem;
    line-height: 1.6;
    p {
      margin-top: 1rem;
    }
    ${below.md} {
      font-size: 1.4rem
    }
  }

  .center {
    text-align: center;
  }




`

export default Typography
