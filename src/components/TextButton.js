import React, {useState} from "react";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatWidget from "../chatbot/ChatWidget";

const TextButton = () => {
    const [chatStatus, setChatStatus] = useState(false)
  const openChat = (e) => {
    setChatStatus(!chatStatus)
  };

  return (
    <div>
      <Button size="large" onClick={openChat} type="primary">
        <MessageOutlined style={{ fontSize: "24px" }} />
      </Button>

      {chatStatus && <ChatWidget />}
      
    </div>
  );
};

export default TextButton;
