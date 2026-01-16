import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import Main from "./Main.js";

ReactDOM.render(
  <React.StrictMode>
     <Main />
  </React.StrictMode>,
  document.getElementById("root")
);

window.addEventListener("error", function (event) {
    sendErrorToBackend(event.message, event.filename, event.lineno, event.colno);
});

window.addEventListener("unhandledrejection", function (event) {
    sendErrorToBackend(event.reason);
});

function sendErrorToBackend(errorMessage, file, line, col) {
    fetch("/sendErrorMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            errorMsg: errorMessage,
            file: file,
            line: line,
            col: col
        })
    });
}

reportWebVitals();