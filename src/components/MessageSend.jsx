import React from "react";
import {
  FaPlusCircle,
  FaGift,
  FaFileImage,
  FaPaperPlane,
} from "react-icons/fa";

function MessageSend({ inputHandler, newMessage, sendMessage }) {
  const emojis = [
    "😀",
    "",
    "😄",
    "😁",
    "😆",
    "",
    "😂",
    "🤣",
    "😊",
    "",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "😝",
    "😜",
    "🧐",
    "🤓",
    "😎",
    "😕",
    "🤑",
    "🥴",
    "😱",
  ];
  return (
    <div className="message-send-section">
      <input type="checkbox" id="emoji" />
      <div className="file hover-attachment">
        <div className="add-attachment">Add Attachment</div>
        <FaPlusCircle />
      </div>
      <div className="file hover-image">
        <div className="add-image">Add Image</div>
        <label htmlFor="pic">
          <FaFileImage />
        </label>
      </div>
      <div className="file hover-gift">
        <div className="add-gift">Add Gift</div>
        <FaGift />
      </div>
      <div className="message-type">
        <input
          type="text"
          className="form-control"
          name="message"
          id="message"
          placeholder="Aa"
          onChange={inputHandler}
          value={newMessage}
        />
        <div className="hover-gift file">
          <label htmlFor="emoji">❤</label>
        </div>
      </div>
      <div className="file" onClick={sendMessage}>
        <FaPaperPlane />
      </div>
      <div className="emoji-section">
        <div className="emoji">
          {emojis.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageSend;
