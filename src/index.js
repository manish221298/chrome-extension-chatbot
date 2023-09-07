
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import VoiceApp from "./VoiceApp";

const root = ReactDOM.createRoot(document.getElementById("root"));
let chatContainer = localStorage.getItem("name");

// let data = JSON.parse(localStorage.getItem("capturedUrlData"));
// let num = 0

// console.log("index.js page", data);

const chatStatus = (status) => {
  chatContainer = status;
  console.log("normal status is chat", status);
  window.location.reload();
};

// console.log("chatContainer chatContainer", chatContainer);

// Function to update data variable and log updated data
// const updateData = () => {
//   data = JSON.parse(localStorage.getItem("capturedUrlData"));
//    num = Math.random()
//   console.log("Updated data:", data, num);
// };

// // Listen for changes in localStorage
// window.addEventListener("storage", (event) => {
//   if (event.key === "capturedUrlData") {
//     updateData();
//   }
// });

root.render(
  <React.StrictMode>
    {chatContainer === "normalChat" && <App />}
    {chatContainer === "voiceChat" && <VoiceApp chatStatus={chatStatus} />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
