import React from "react";

const Message = ({ author, content }) => (
  <div className="message-list">
    <div className="message">
      <div className="content">{content}</div>
      <div className="author">{author}</div>
    </div>
  </div>
);

export default Message;
