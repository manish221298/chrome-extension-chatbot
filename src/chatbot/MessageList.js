import React from 'react'
import Message from './Message';


const MessageList = ({ messages }) => (
    <div>
      {messages.map((message, index) => (
        <Message key={index} author={message.author} content={message.content} />
      ))}
    </div>
  );


  export default MessageList