import React, { useEffect, useState } from "react";
import "./App.css";
import ChatWidget from "./chatbot/ChatWidget";

function App() {

  const chatContainer = localStorage.getItem('name');

  return (
    <div className="App">
      {chatContainer === 'normalChat' && <ChatWidget />}
    </div>
  );
}

export default App;

