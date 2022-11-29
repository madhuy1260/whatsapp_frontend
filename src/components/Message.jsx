import React from "react";
import { useSelector } from "react-redux";

function Message({ message, currentFriend, scrollRef }) {
  const { myInfo } = useSelector((state) => state.auth);
  return (
    <div className="message-show">
      {message && message.length > 0
        ? message.map((eachMessage) =>
            eachMessage.senderId === myInfo.id ? (
              <div className="my-message" ref={scrollRef}>
                <div className="image-message">
                  <div className="my-text">
                    <p className="message-text">{eachMessage.message.text}</p>
                  </div>
                </div>
                <div className="time">2 jan 2022</div>
              </div>
            ) : (
              <div className="fd-message" ref={scrollRef}>
                <div className="image-message-time">
                  <img src={`/image/${currentFriend.image}`} alt="" />
                  <div className="message-time">
                    <div className="fd-text">
                      <p className="message-text">{eachMessage.message.text}</p>
                    </div>
                    <div className="time">3rd Jan 2023</div>
                  </div>
                </div>
              </div>
            )
          )
        : ""}
    </div>
  );
}

export default Message;
