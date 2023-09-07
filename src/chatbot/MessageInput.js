import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const MessageInput = ({ onSendMessage }) => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [input, setInput] = useState("");
  const inputRef = useRef(null); // Create a ref for the input element

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      inputRef.current.focus(); // Focus on the input element
    }
  };

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  // Rest of your component code...

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim() !== "") {
      onSendMessage("user", transcript);
      setInput(transcript);
      resetTranscript();
    } else if (input.trim() !== "") {
      onSendMessage("user", input);
      setInput("");

      // Clear the local storage value
      localStorage.removeItem("capturedUrlData");
      localStorage.removeItem("clickedUrlData");
      localStorage.setItem("submit", "submit");
      setUrlData([]); // Update state to reflect the change
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (urlData.length > 0) {
      setData(urlData);
    } else {
      setData(capturedUrlData);
    }
  }, [urlData, capturedUrlData]);

  console.log("updated url data after filter out", data)
  
  return (
    <div className="message-input">
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          value={listening ? transcript : input}
          onChange={handleInputChange}
          onKeyDown={handleEnterPress}
          placeholder="Type something..."
          style={{ height: "5rem", fontSize: "25px", border: "1px solid gray" }}
        />
      </form>
      <button onClick={handleStartListening}>
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
    </div>
  );
};

export default MessageInput;
