import React from "react";
import { FaCaretSquareDown } from "react-icons/fa";

function FriendInfo({ currentFriend, activeUser, message }) {
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={`/image/${currentFriend.image}`} alt="" />
        </div>
        {activeUser &&
        activeUser.length > 0 &&
        activeUser.some((user) => user.userId === currentFriend._id) ? (
          <div className="active-user">Active</div>
        ) : (
          ""
        )}

        <div className="name">
          <h4>{currentFriend.userName}</h4>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h3>Customize Chat</h3>
          <FaCaretSquareDown />
        </div>
        <div className="privacy">
          <h3>Privacy & Support</h3>
          <FaCaretSquareDown />
        </div>
        <div className="media">
          <h3>Shared Media</h3>
          <label htmlFor="gallery">
            <FaCaretSquareDown />
          </label>
        </div>
      </div>
      <div className="gallery">
        {message && message.length > 0
          ? message.map(
              (e, i) =>
                e.message.image && (
                  <img src={`./image/${e.message.image}`} alt="" key={i} />
                )
            )
          : ""}
      </div>
    </div>
  );
}

export default FriendInfo;
