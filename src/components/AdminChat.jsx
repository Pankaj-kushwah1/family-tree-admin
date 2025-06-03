import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const AdminChat = ({ token }) => {
  const socketRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // Connect to socket on mount
  useEffect(() => {
    socketRef.current = io("https://backend.rmmbr.me", {
      auth: { token },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket");
    });

    socketRef.current.on("message", (msgs) => {
      setMessages(msgs);
    });

    socketRef.current.on("message-user", (userData) => {
      setSelectedUser(userData);
    });

    socketRef.current.on("conversation", (convos) => {
      setUserList(convos);
    });

    socketRef.current.emit("sidebar", getCurrentUserIdFromToken(token));

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  const getCurrentUserIdFromToken = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      setCurrentUserId(payload._id);
      return payload._id;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  const handleUserClick = (userId) => {
    socketRef.current.emit("message-page", userId);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const data = {
      text: messageText,
      sender: currentUserId,
      receiver: "679a6942d8843cee8f537ece",
      msgByUserId: currentUserId,
    };

    socketRef.current.emit("new message", data);
    setMessageText("");
  };

  const markAsSeen = () => {
    if (selectedUser?._id) {
      socketRef.current.emit("seen", selectedUser._id);
    }
  };

  useEffect(() => {
    markAsSeen();
  }, [messages]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Conversations</h2>
        {userList?.map((user) => (
          <div
            key={user._id}
            className={`p-2 mb-2 cursor-pointer rounded ${
              selectedUser?._id === user._id ? "bg-blue-200" : "bg-white"
            }`}
            onClick={() => handleUserClick(user._id)}
          >
            <p>{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col p-4">
        <div className="border-b pb-2 mb-2">
          <h3 className="text-xl font-semibold">
            {selectedUser ? selectedUser.name : "Select a user"}
          </h3>
        </div>

        <div className="flex-1 overflow-auto border rounded p-2 mb-2 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 my-1 rounded max-w-lg ${
                msg.msgByUserId === currentUserId
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex mt-2">
          <input
            type="text"
            className="flex-1 border rounded p-2 mr-2"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminChat