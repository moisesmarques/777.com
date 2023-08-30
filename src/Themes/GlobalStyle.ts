import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  html {
    overflow: -moz-scrollbars-vertical; 
    overflow-y: scroll;
  }

  html, body, #root {
    -webkit-font-smoothing: antialiased;
    height: 100%;
    width: 100%;
  }

  body, input, button, textarea {
    font-family: Roboto,sans-serif;
    font-size: 16px;
    border: 0;
  }

  p {
    font-family: Roboto,sans-serif;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    position: relative;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 5px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 700;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 18px;
  }

  h3 {
    font-size: 16px;
  }

  h4 {
    text-align: left;
    font-size: 14px;
    line-height: 48px;
    font-weight: 500;
  }

  ul {
    list-style-type: none;
  }

  a {
    color: var(--font-color);
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      transition: all 0.3s ease;
    }
  }

  li > a {
    &:hover {
      text-decoration: none;
    }
  }
  
  @font-face {
    font-family: 'Rubik Mono One';
    font-style: normal;
    font-weight: 400;
    src: local('Rubik Mono One'),
         local('RubikMonoOne-Regular'),
         url(/assets/RubikMonoOne-Regular.ttf) format('truetype');
  }
`;