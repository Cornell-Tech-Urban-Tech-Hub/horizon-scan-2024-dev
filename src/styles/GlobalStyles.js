import { createGlobalStyle } from "styled-components";
import { normalize } from "polished";
// import { above, below } from "./utilities/breakpoints"

const GlobalStyles = createGlobalStyle`

${normalize()};

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

a:link, a:visited {
  color: ${(props) => props.theme.colors.link};
}

strong {
  font-weight: bold;
}

.divider-center {
  display: flex;
  align-items: center;
    margin: 2rem -1rem 2rem;
    &:before,
    &:after {
      content: "";
    flex: 1;
    height: 1px;
    margin: 0.15rem 1rem 0;
    background: #000
    }
}

.gatsby-image-wrapper {
   position: relative;
   z-index: 0; 
}

`;
export default GlobalStyles;
