import React from 'react';
import './Loading.css';

const MyComponent = () => {
  return (
    <div id="overlay-loader">
      <div id="container">
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="h3">loading</div>
      </div>
    </div>
  );
};


export default MyComponent;
