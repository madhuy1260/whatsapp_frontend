import React from "react";

function ActiveFriend({ user, setCurrentFriend }) {
  return (
    <div
      className="active-friend"
      onClick={() =>
        setCurrentFriend({
          _id: user.userInfo.id,
          email: user.userInfo.email,
          image: user.userInfo.image,
          userName: user.userInfo.userName,
        })
      }
    >
      <div className="image-active-icon">
        <div className="image">
          <img
            src={`./image/${user.userInfo.image}`}
            alt=""
            title={user.userInfo.userName}
          />
          <div className="active-icon"></div>
        </div>
      </div>
    </div>
  );
}

export default ActiveFriend;
