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
  @font-face {
    font-family: 'Rubik';
    font-style: normal;
    font-weight: 700;
    src: url(/assets/Rubik-700.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  #background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(/assets/full-background.png) no-repeat center center fixed;
    z-index: -1;
    background-size: cover;
    filter: blur(4px);
    opacity: 0.3;
  }

  .ul {
    font-size: 12px;
    color: #e0e0e0;
    padding: 20px;
    list-style: square;
  }

  .ul li {
    margin-bottom: 10px;
  }

  .span-paytable li span{
    display: block;
    color: #ffcc00;
    text-align: center;
  }

  .span-icons li{
    margin-bottom: 32px;
    margin-left: 48px;
    position: relative;
  }

  .span-icons li img{
    position: absolute;
    left: -64px;

  }
`;