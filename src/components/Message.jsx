import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaRegCheckCircle } from "react-icons/fa";

function Message({ message, currentFriend, scrollRef, typingMessage }) {
  const { myInfo } = useSelector((state) => state.auth);
  return (
    <>
      <div className="message-show">
        {message && message.length > 0 ? (
          message.map((eachMessage, i) =>
            eachMessage.senderId === myInfo.id ? (
              <div className="my-message" ref={scrollRef} key={i}>
                <div className="image-message">
                  <div className="my-text">
                    <p className="message-text">
                      {eachMessage.message.text === "" ? (
                        <img
                          src={`./image/${eachMessage.message.image}`}
                          alt=""
                        />
                      ) : (
                        eachMessage.message.text
                      )}
                    </p>
                    {i === message.length - 1 &&
                    eachMessage.senderId === myInfo.id ? (
                      eachMessage.status === "seen" ? (
                        <img
                          src={`./image/${currentFriend.image}`}
                          className="img"
                          alt=""
                        />
                      ) : eachMessage.status === "delivered" ? (
                        <span>
                          <FaRegCheckCircle />
                        </span>
                      ) : (
                        <span>
                          <FaRegCheckCircle />
                        </span>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="time">
                  {moment(eachMessage.createdAt).startOf("mini").fromNow()}{" "}
                </div>
              </div>
            ) : (
              <div className="fd-message" ref={scrollRef} key={i}>
                <div className="image-message-time">
                  <img src={`/image/${currentFriend.image}`} alt="" />
                  <div className="message-time">
                    <div className="fd-text">
                      <p className="message-text">
                        {eachMessage.message.text === "" ? (
                          <img
                            src={`./image/${eachMessage.message.image}`}
                            alt=""
                          />
                        ) : (
                          eachMessage.message.text
                        )}
                      </p>
                    </div>
                    <div className="time">
                      {moment(eachMessage.createdAt).startOf("mini").fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="friend_connect">
            <img src={`./image/${currentFriend.image}`} alt="" />
            <h3>Start Messaging with -- {currentFriend.userName}</h3>
            <span>
              {" "}
              created Account --{"  "}
              {moment(currentFriend.createdAt).startOf("mini").fromNow()}
            </span>
          </div>
        )}
      </div>
      {typingMessage &&
      typingMessage.msg &&
      typingMessage.senderId === currentFriend._id ? (
        <div className="typing-message">
          <div className="fd-message">
            <div className="image-message-time">
              <img src={`/image/${currentFriend.image}`} alt="" />
              <div className="message-time">
                <div className="fd-text">
                  <p className="time">
                    {currentFriend.userName} is Typing a Message ...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Message;
