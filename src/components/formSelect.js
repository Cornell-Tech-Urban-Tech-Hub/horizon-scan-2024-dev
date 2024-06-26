import React from "react"
// import PropTypes from "prop-types"
import styled from "styled-components"

const SelectGroup = styled.div`
  font-family: ${({ theme }) => theme.type.sans};

  label {
    display: block;
    margin-top: 0.25rem;
    color: rgba(0, 0, 0, 0.8);
    /* color: #999; */
  }

  select {
    display: block;
    width: 100%;
  }

  select {
    // A reset of styles, including removing the default dropdown arrow
    appearance: none;

    // Additional resets for further consistency
    /* background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit; */
    background-color: hsl(0, 0%, 100%);
    border-color: hsl(0, 0%, 80%);
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 10px 8px;

    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="select-arrow"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>');
    background-size: 1.25em 1.25em;
    background-repeat: no-repeat;
    background-position: 96% 50%;
  }
`

export const FormSelect = ({ id, label, onChange, value, options }) => (
  <SelectGroup>
    <label id={`select-${id}-label`} htmlFor={`select-${id}`}>
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      id={`select-${id}`}
      aria-labelledby={`select-${id}-label`}
    >
      {options?.map((option, i) => (
        <option key={`${id}-option-${i}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </SelectGroup>
)
