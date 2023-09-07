import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const VoiceCall = ({ chatStatus }) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const [input, setInput] = useState("");
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleVoiceButtonClick = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      setHasSpoken(false);
    }
  };

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!listening && transcript && !hasSpoken) {
      // Automatically speak back when user stops speaking
      textToSpeech();
      setHasSpoken(true);
    }
  }, [transcript, listening, hasSpoken]);


  const [urlData, setUrlData] = useState([]);
  const [capturedUrlData, setCapturedUrlData] = useState([]);
  const [data, setData] = useState([])

  useEffect(() => {
    // Retrieve initial values from localStorage
    const initialCapturedUrlData = getStoredCapturedUrlData();
    const initialClickedUrlData = getStoredClickedUrlData();
    setCapturedUrlData(initialCapturedUrlData);
    setUrlData(initialClickedUrlData);

    // Listen for changes in localStorage
    window.addEventListener("storage", handleLocalStorageChange);

    // Clean up the listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, []);

  const handleLocalStorageChange = (event) => {
    if (event.key === "clickedUrlData") {
      const updatedClickedUrlData = getStoredClickedUrlData();
      setUrlData(updatedClickedUrlData);
    } else if (event.key === "capturedUrlData") {
      const updatedCapturedUrlData = getStoredCapturedUrlData();
      setCapturedUrlData(updatedCapturedUrlData);
    }
  };

  const getStoredClickedUrlData = () => {
    const storedValue = localStorage.getItem("clickedUrlData");
    return storedValue ? JSON.parse(storedValue) : [];
  };

  const getStoredCapturedUrlData = () => {
    const storedValue = localStorage.getItem("capturedUrlData");
    return storedValue ? JSON.parse(storedValue) : [];
  };

  useEffect(() => {
    if (urlData.length > 0) {
      setData(urlData);
    } else {
      setData(capturedUrlData);
    }
  }, [urlData, capturedUrlData]);

  console.log("updated url data after filter out", data)

  // integrate elevenlab text-to-speech api
  async function textToSpeech() {
    try {
      const message = "Sorry Manish, Chat-boat is not integratd";

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`,
        {
          method: "POST",
          headers: {
            accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": process.env.REACT_APP_ELEVEN_LAB_API_KEY,
          },
          body: JSON.stringify({
            text: input,
            voice_settings: {
              stability: 0,
              similarity_boost: 0,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const arrayBuffer = await response.arrayBuffer();

      // Simulate writing the file and display response in console
      const file = Math.random().toString(36).substring(7);
      console.log("File written successfully");
      console.log("Response:", file);

      // Simulate saving or using the audio data
      // For example, you can create a Blob and save it to a file
      const audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const chatwithme = () => {
    localStorage.setItem("name", "normalChat");
    chatStatus("normalChat");
  };

  return (
    <div className="voice-call">
      <span  className="voice-chat-span">ShopAdvisor</span>
      <button className="voice-chat-button" onClick={handleVoiceButtonClick}>
        {/* {listening ? "Stop Listening" : "Start Listening"} */}
        {listening ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-mic-fill"
            viewBox="0 0 16 16"
          >
            <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-mic-mute-fill"
            viewBox="0 0 16 16"
          >
            <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z" />
            <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z" />
          </svg>
        )}
      </button>

      <button className="voice-chat-button" onClick={chatwithme}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          class="bi bi-chat-dots-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </button>
      {input && (
        <div className="transcript">
          <p>You said: {input}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceCall;
