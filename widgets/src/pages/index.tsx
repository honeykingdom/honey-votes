// https://github.com/vercel/next.js/tree/canary/examples/with-emotion
import type { NextPage } from 'next';
import { css, Global } from '@emotion/react';
import ChatGoalWidget from '../components/ChatGoalWidget';

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  html {
    font-size: 20px;
  }
  body {
    display: flex;
    align-items: flex-end;
    height: 100vh;
    padding: 0;
    margin: 0;
  }
`;

const Home: NextPage = () => (
  <>
    <Global styles={globalStyles} />
    <ChatGoalWidget />
  </>
);

export default Home;
