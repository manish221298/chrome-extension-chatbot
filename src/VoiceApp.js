// App.js
import React from "react";
import "./App.css";
import VoiceCall from "./voicechat/VoiceCall";

function VoiceApp({chatStatus}) {

 

  return (
    <div className="voice-app">
      <VoiceCall chatStatus={chatStatus} />
     
    </div>
  );
}

export default VoiceApp;
