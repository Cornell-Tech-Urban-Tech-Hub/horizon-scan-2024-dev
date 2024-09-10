import React, { useState } from "react";
// import PropTypes from "prop-types"
import styled from "styled-components";

const StyledLoadingIcon = styled.div`
  font-family: ${({ theme }) => theme.type.sans};
  font-weight: bold;
  color: #ccc;

  /* Standard Styles */
  .loading-block {
    display: flex;
    align-items: center;
    vertical-align: baseline;
  }

  /* loader style based on https://tobiasahlin.com/spinkit/ */
  .spinner {
    display: inline-block;
    margin-right: 10px;
    height: 30px;
  }

  .spinner > div {
    background-color: #aaa;
    height: 30px;
    width: 5px;
    margin-right: 1px;
    display: inline-block;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      -webkit-transform: scaleY(0.4);
    }
    20% {
      -webkit-transform: scaleY(1);
    }
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }
`;

export const LoadingIcon = ({ message = "Loading" }) => (
  <StyledLoadingIcon>
    <div class="loading-block">
      <div class="spinner">
        <div class="rect1" />
        <div class="rect2" />
        <div class="rect3" />
        <div class="rect4" />
        <div class="rect5" />
      </div>
      {message}
    </div>
  </StyledLoadingIcon>
);
