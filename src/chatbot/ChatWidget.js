import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Layout } from "antd";
const { Footer, Content } = Layout;

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (author, content) => {
    const newMessage = { author, content };
    setMessages([...messages, newMessage]);
  };

  const simulateBotReply = (userMessage) => {
    // Simulate a bot response (you can replace this with actual bot logic)
    const botResponse = `${userMessage}`;
    setTimeout(() => {
      setMessages([
        ...messages,
        { author: botResponse, content: botResponse },
      ]);
    }, 500);
  };

  console.log("message message", messages);

  useEffect(() => {
    // Simulate bot's initial greeting
    simulateBotReply("Hello!");
  }, []); // Run this effect only once

  return (
    <Layout>
      {/* <Content> */}
      <MessageList messages={messages} />
      {/* </Content> */}
      <Footer className="chat-footer">
        <MessageInput
          onSendMessage={(author, content) => {
            handleSendMessage(author, content);
            simulateBotReply(content);
          }}
        />
      </Footer>
    </Layout>
  );
};

export default ChatWidget;
