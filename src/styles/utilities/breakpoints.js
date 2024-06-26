import theme from "../Theme"
// import { css } from "styled-components"

export const above = Object.keys(theme.sizes).reduce((acc, label) => {
  acc[label] = `@media (min-width: ${theme.sizes[label] / 16}em)`
  return acc
}, {})

export const below = Object.keys(theme.sizes).reduce((acc, label) => {
  acc[label] = `@media (max-width: ${theme.sizes[label] / 16}em)`
  return acc
}, {})

// export const above = Object.keys(size).reduce((acc, label) => {
//   acc[label] = `@media (min-width: ${size[label]}px)`
//   return acc
// }, {})

// export const below = Object.keys(size).reduce((acc, label) => {
//   acc[label] = `@media (max-width: ${size[label]}px)`
//   return acc
// }, {})

// export const above2 = Object.keys(size).reduce((acc, label) => {
//   acc[label] = (...args) => css`
//     @media (min-width: ${size[label] / 16}em) {
//       ${css(...args)}
//     }
//   `
//   return acc
// }, {})

// export const below2 = Object.keys(size).reduce((acc, label) => {
//   acc[label] = (...args) => css`
//     @media (max-width: ${size[label] / 16}em) {
//       ${css(...args)}
//     }
//   `
//   return acc
// }, {})
