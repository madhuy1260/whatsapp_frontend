import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEllipsisH, FaEdit, FaSistrix, FaSignOutAlt } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import {
  getFriends,
  messageSend,
  getMessage,
  ImageMessageSend,
  seenMessage,
  updateMessage,
  getTheme,
  themeSet,
} from "../store/actions/messengerAction";
import { userLogout } from "../store/actions/authActions";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import notificationSound from "../audio/notification.mp3";
import sendingSound from "../audio/sending.mp3";
import {
  MESSAGE_SEND_SUCCESS,
  MESSAGE_SEND_SUCCESS_CLEAR,
  NEW_USER_ADD_CLEAR,
} from "../store/types/messengerType";

const Messenger = () => {
  const [notificationSPlay] = useSound(notificationSound);
  const [sendingSPlay] = useSound(sendingSound);
  const [hide, setHide] = useState(true);

  const scrollRef = useRef();
  const socket = useRef();

  const [currentFriend, setCurrentFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeUser, setActiveUser] = useState([]);
  const [socketMessage, setSocketMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");

  const {
    friends,
    message,
    messageSendSuccess,
    message_get_success,
    themeMood,
    new_user_add,
  } = useSelector((state) => state.messenger);
  const { myInfo } = useSelector((state) => state.auth);

  //initializing the connection frontend to socket
  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      // console.log(data);
      setSocketMessage(data);
    });
    socket.current.on("typingMessageGet", (data) => {
      // console.log(data);
      setTypingMessage(data);
    });
    socket.current.on("msgSeenResponse", (msg) => {
      // console.log(data);
      dispatch({ type: "SEEN_MESSAGE", payload: { msgInfo: msg } });
    });
    socket.current.on("msgDeliveredResponse", (msg) => {
      // console.log(data);
      dispatch({ type: "DELIVERED_MESSAGE", payload: { msgInfo: msg } });
    });
    socket.current.on("seenSuccess", (data) => {
      dispatch({
        type: "SEEN_ALL",
        payload: data,
      });
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage.senderId === currentFriend._id &&
        socketMessage.receiverId === myInfo.id
      ) {
        dispatch({
          type: "SOCKET_MESSAGE",
          payload: {
            message: socketMessage,
          },
        });
        //action to dispaly the message status :seeen delivered unseen
        dispatch(seenMessage(socketMessage));
        socket.current.emit("messageSeen", socketMessage);
        //updating the message on friends list display last message here
        dispatch({
          type: "UPDATE_FRIEND_MESSAGE",
          payload: {
            msgInfo: socketMessage,
            status: "seen",
          },
        });
      }
    }
    setSocketMessage("");
  }, [socketMessage]);

  //sending the all data from frontend to socket
  useEffect(() => {
    socket.current.emit("addUser", myInfo.id, myInfo);
  }, []);

  //receiving the command from socket
  useEffect(() => {
    socket.current.on("getUser", (users) => {
      const filterUser = users.filter(
        (eachUser) => eachUser.userId !== myInfo.id
      );
      setActiveUser(filterUser);
    });
    //getting recent added user from socket to the friend list
    socket.current.on("new_user_add", (data) => {
      dispatch({ type: "NEW_USER_ADD", payload: { new_user_add: data } });
    });
  }, []);

  const dispatch = useDispatch();

  const inputHandler = (e) => {
    setNewMessage(e.target.value);

    //to show the message that your friend is typing
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: e.target.value,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    sendingSPlay();
    const data = {
      senderName: myInfo.userName,
      receiverId: currentFriend._id,
      message: newMessage ? newMessage : "❤",
    };

    //clearing the typing Message here after the message is sent
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: "",
    });
    //sending to the database
    dispatch(messageSend(data));
    setNewMessage("");
  };

  //checking whether the data is saving or not in the database after sending it to socket
  //adding the secured code in useEffect
  useEffect(() => {
    if (messageSendSuccess) {
      //sending every message to the socket before sending it to the database
      socket.current.emit("sendMessage", message[message.length - 1]);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: { msgInfo: message[message.length - 1] },
      });
      dispatch({ type: MESSAGE_SEND_SUCCESS_CLEAR });
    }
  }, [messageSendSuccess]);

  useEffect(() => {
    dispatch(getFriends());
    dispatch({
      type: NEW_USER_ADD_CLEAR,
    });
  }, [new_user_add]);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCurrentFriend(friends[0].fndInfo);
    }
  }, [friends]);

  useEffect(() => {
    dispatch(getMessage(currentFriend._id));
    if (friends.length > 0) {
    }
  }, [currentFriend?._id]);

  useEffect(() => {
    if (message.length > 0) {
      if (
        message[message.length - 1].senderId !== myInfo.id &&
        message[message.length - 1].status !== "seen"
      ) {
        dispatch({ type: "UPDATE", payload: { id: currentFriend._id } });

        socket.current.emit("seen", {
          senderId: currentFriend._id,
          receiverId: myInfo.id,
        });
        dispatch(seenMessage({ _id: message[message.length - 1]._id }));
      }
    }
    dispatch({ type: "MESSAGE_GET_SUCCESS_CLEAR" });
  }, [message_get_success]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    //popup for another friend message-- toast
    if (
      socketMessage &&
      socketMessage.senderId !== currentFriend._id &&
      socketMessage.receiverId === myInfo.id
    ) {
      notificationSPlay();
      toast.success(`${socketMessage.senderName} sent a New Message`);
      //action to dispaly the message status :seeen delivered unseen
      dispatch(updateMessage(socketMessage));
      socket.current.emit("deliveredMessage", socketMessage);
      //updating the message on friends list display last message here
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          msgInfo: socketMessage,
          status: "delivered",
        },
      });
    }
  }, []);

  // console.log(currentFriend);

  const emojiSend = (emu) => {
    setNewMessage(`${newMessage}` + emu);
    //show typing message when selecting the emoji also
    //passing this info to the socket
    socket.current.emit("typingMessage", {
      senderId: myInfo.id,
      receiverId: currentFriend._id,
      msg: emu,
    });
  };

  const imageSend = (e) => {
    if (e.target.files.length !== 0) {
      sendingSPlay();
      const imageName = e.target.files[0].name;
      const newImageName = Date.now() + imageName;

      //sending images to socket
      socket.current.emit("sendMessage", {
        senderId: myInfo.id,
        senderName: myInfo.userName,
        receiverId: currentFriend._id,
        time: new Date(),
        message: {
          text: "",
          image: newImageName,
        },
      });

      const formData = new FormData();
      formData.append("senderName", myInfo.userName);
      formData.append("receiverId", currentFriend._id);
      formData.append("imageName", newImageName);
      formData.append("image", e.target.files[0]);
      dispatch(ImageMessageSend(formData));
    }
  };

  const logout = () => {
    dispatch(userLogout());
    socket.current.emit("logout", myInfo.id);
  };

  useEffect(() => {
    dispatch(getTheme());
  }, []);

  const search = (e) => {
    const getFriendClass = document.getElementsByClassName("hover-friend");
    const friendNameClass = document.getElementsByClassName("Fd_name");
    for (
      var i = 0;
      i < getFriendClass.length, i < friendNameClass.length;
      i++
    ) {
      let text = friendNameClass[i].innerText.toLowerCase();
      if (text.indexOf(e.target.value.toLowerCase()) - 1) {
        getFriendClass[i].style.display = "";
      } else {
        getFriendClass[i].style.display = "none";
      }
    }
  };

  return (
    <div className={themeMood === "dark" ? "messenger theme" : "messenger"}>
      <Toaster
        position="top-center"
        reverseOrder={true}
        toastOptions={{
          duration: 10000,
          style: { fontSize: "18px", background: "#363636", color: "#fff" },
        }}
      />
      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="image">
                  <img src={`./image/${myInfo.image}`} alt="" />
                </div>
                <div className="name">
                  <h3> {myInfo.userName}</h3>
                </div>
              </div>
              <div className="icons">
                <div className="icon" onClick={() => setHide(!hide)}>
                  <FaEllipsisH />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
                <div className={hide ? "theme_logout" : "theme_logout show"}>
                  <h3>Dark Mode</h3>
                  <div className="on">
                    <label htmlFor="dark">ON</label>
                    <input
                      type="radio"
                      onChange={(e) => dispatch(themeSet(e.target.value))}
                      value="dark"
                      name="theme"
                      id="dark"
                    />
                  </div>
                  <div className="of">
                    <label htmlFor="white">OFF</label>
                    <input
                      type="radio"
                      onChange={(e) => dispatch(themeSet(e.target.value))}
                      value="white"
                      name="theme"
                      id="white"
                    />
                  </div>
                  <div className="logout" onClick={logout}>
                    <FaSignOutAlt /> . Logout
                  </div>
                </div>
              </div>
            </div>
            <div className="friend-search">
              <div className="search">
                <button>
                  <FaSistrix />
                </button>
                <input
                  type="text"
                  onChange={search}
                  className="form-control"
                  placeholder="Search"
                />
              </div>
            </div>
            {/* <div className="active-friends">
              {activeUser && activeUser.length > 0
                ? activeUser.map((user) => (
                    <ActiveFriend
                      user={user}
                      setCurrentFriend={setCurrentFriend}
                    />
                  ))
                : "No Active Users available Now"}
            </div> */}
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((each, i) => (
                    <div
                      key={i}
                      className={
                        currentFriend._id === each.fndInfo._id
                          ? "hover-friend active"
                          : "hover-friend"
                      }
                      onClick={() => setCurrentFriend(each.fndInfo)}
                    >
                      <Friends
                        myId={myInfo.id}
                        friend={each}
                        activeUser={activeUser}
                      />
                    </div>
                  ))
                : "No Friends"}
            </div>
          </div>
        </div>
        {currentFriend ? (
          <RightSide
            currentFriend={currentFriend}
            inputHandler={inputHandler}
            newMessage={newMessage}
            sendMessage={sendMessage}
            message={message}
            scrollRef={scrollRef}
            emojiSend={emojiSend}
            imageSend={imageSend}
            activeUser={activeUser}
            typingMessage={typingMessage}
          />
        ) : (
          "Please select one of your friend"
        )}
      </div>
    </div>
  );
};

export default Messenger;
