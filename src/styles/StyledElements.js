import styled, { css } from "styled-components"
import { above, below } from "./utilities/breakpoints"

// LAYOUT
export const Section = styled.section``

export const Content = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 1rem auto;
  /* display: grid; */
  // grid-template-columns: 3fr 1fr;
  // grid-gap: 40px
`

export const SectionMeta = styled.div`
  background-color: #fef6ea;
  padding-top: 2rem;
  padding-bottom: 2rem;

  h5 {
    font-family: ${props => props.theme.type.sans};
    font-size: 1rem;
    font-weight: 400;
  }

  .categories {
    font-family: ${props => props.theme.type.sans};
  }
`

export const PageHeader = styled.header`
  padding-top: 3rem;
  min-height: 150px;
`

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-bottom: 2rem;

  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  /* margin-bottom: 1rem; */

  ${props => (props.collapse ? below[props.collapse] : below["md"])} {
    flex-direction: column;
  }
`

// ${({ active }) => active && `
// background: blue;
// `}

export const RowWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const ColBase = styled.div`
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
`

export const Col = styled(ColBase)`
  flex: ${props => (props.size ? props.size : 1)};
  flex-direction: column;

  ${below["lg"]} {
    flex: ${props => (props.size && props.size > 2 ? 2 : 1)};
  }

  ${({ outer }) =>
    outer &&
    css`
      padding-left: 0rem;
      padding-right: 0rem;
    `}

  ${({ block }) => block && "width: 100%;"}
`

export const ColCard = styled(ColBase)`
  padding-bottom: 2rem;

  width: 100%;
  ${above.sm} {
    width: 50%;
  }
  ${above.lg} {
    width: 33.3333%;
  }
`

export const ColStatement = styled(ColBase)`
  width: 66.6666%;
  ${below.md} {
    width: 100%;
  }
`

export const Statement = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  //grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 4rem;

  blockquote {
    margin-left: 0;
    font-size: 2rem;
    line-height: 1.4;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  grid-auto-rows: auto auto;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  blockquote {
    margin-left: 0;
    font-size: 1.8rem;
    line-height: 1.2;
  }
`

export const CardsIntro = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  padding: 0 20%;
  text-align: center;
  ${below.laptop} {
    padding: 0;
  }
`

export const ImageCredit = styled.div`
  font-size: 0.8rem;
  max-width: 90%;
  text-align: right;
  margin: 0.25rem auto;
  color: #777;
`

export const ImageCreditInline = styled.div`
  font-size: 0.8rem;
  text-align: left;
  color: #777;
`

export const ImageCreditOver = styled.div`
  position: absolute;
  color: #fff;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  font-size: 0.8rem;
  padding: 0 0.4rem;
  text-align: right;
`
