import React from 'react';

import logo from './logo.svg';

const Landing = () => (
  <div className="App">
    <header className="App-header">
      <h1>ОАО "ГСКБ"</h1>
      <h2>Испытательный центр</h2>
      <h3>Химическая лаборатория "Топливо"</h3>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Программа (база данных) учета оборудования и расходных материалов (реактивов).
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
    <h1>Landing</h1>
  </div>
);

export default Landing;
