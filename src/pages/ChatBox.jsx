import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import { useDispatch } from "react-redux";
import { allConversationsList } from "../utils/authUtils";

function ChatBox({ user }) {
  const socketRef = useRef();
  const chatBoxRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzlhNjk0MmQ4ODQzY2VlOGY1MzdlY2UiLCJpYXQiOjE3NDkxNDU3MzZ9.LnGTnHjczwyBmq9dEw8No6tpqrkZcPwIaU7PZGOCFzE";
  const my_id = "679a6942d8843cee8f537ece"; // pankaj
  const user_id = "679a6dced8843cee8f538377"; // RAM
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODFlM2RiM2U0YWRlYjdhMWJmYTg0YzIiLCJpYXQiOjE3NDkxNDU2OTN9.dLS89hbPSMG60JOFVL0C74NF3SzfaiIE8cCV0bmtkBk";
  // const my_id = "681e3db3e4adeb7a1bfa84c2"; // admin

  // const BASE_URL = import.meta.env.CHAT_URL; 
  const BASE_URL = "https://backend.rmmbr.me/";
  // const dispatch = useDispatch();

  useEffect(() => {
    const loadMessages = async () => {
      const initialMessages = await allConversationsList();
      const selectedMessages =
        initialMessages.conversation.find((item) => item.userDetails._id === user._id)?.messages || [];
      setMessages(selectedMessages);
    };

    loadMessages();

    const socket = io(BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // auth: {
      //   token: token,
      // },
    });

    console.log("Socket", socket)

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsSocketConnected(true);
    });

    socket.on("message", (newMessages) => {
      setMessages([...newMessages]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [BASE_URL, token]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if ((message.trim() || imageFile) && socketRef.current) {

      const newMessage = {
        text: message.trim(),
        sender: "679a6dced8843cee8f538377",
        receiver: user_id,
        msgByUserId: "679a6dced8843cee8f538377",
      };

      if (socketRef.current.connected) {
        socketRef.current.emit("new message", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        // setSelectedImage(null);
        setImageFile(null);
      } else {
        console.error("Socket is not connected!");
      }
    }
  };

  return (
    <div className="container my-4 d-flex justify-content-between flex-column h-100">
      {/* <ChatUserDetails user={user} /> */}
      <div
        className="chat-box w-100"
        ref={chatBoxRef}
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            // imageUrl={msg.imageUrl}
            isSender={msg.msgByUserId === my_id}
            avatar="https://via.placeholder.com/40"
          // onClickImage={() => setPreviewImage(msg.imageUrl)}
          />
        ))}
      </div>

      <div className="card-footer p-3 w-100">
        {/* Image Preview - Left Side */}
        {selectedImage && (
          <div className="d-flex align-items-center mb-2">
            {/* Remove Image Button (Left Side) */}
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={removeSelectedImage}
            >
              <FiX size={18} />
            </button>

            {/* Preview Image */}
            <img
              src={selectedImage}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: "80px", borderRadius: "8px" }}
            />
          </div>
        )}

        {/* Bottom Section - Image Upload, Text Input, and Send Button */}
        <div className="d-flex align-items-center">
          {/* Image Upload Button */}
          {/* <label className="btn btn-light p-2 rounded-circle me-2">
      <FiImage size={18} />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </label> */}

          {/* Text Input */}
          <input
            type="text"
            className="form-control flex-grow-1 p-2"
            style={{ backgroundColor: "#f5f5f5", border: "none", borderRadius: "20px" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />

          {/* Send Button */}
          <button
            type="submit"
            className="btn btn-dark rounded-pill p-2 ms-2"
            disabled={isUploading}
            onClick={sendMessage}
          >
            {isUploading ? "Uploading..." : "Send"}
          </button>
        </div>
      </div>


      {/* Fullscreen Image Preview */}
      {/* {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }}
          />
        </div>
      )} */}
    </div>
  );
}

function ChatMessage({ message, isSender }) {
  return (
    <div className={`d-flex ${isSender ? "justify-content-end" : "justify-content-start"} align-items-start my-2`}>
      <div
        className="px-3 py-2 d-flex flex-column"
        style={{
          backgroundColor: isSender ? "#d1f7c4" : "#f1f1f1",
          borderRadius: "16px",
          maxWidth: "60%",
          fontSize: "16px",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
        }}
      >
        {/* Image at the Top */}
        {/* {imageUrl && (
          <img
            src={imageUrl}
            alt="Sent"
            style={{
              maxWidth: "100px",
              borderRadius: "8px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
            onClick={onClickImage}
          />
        )} */}

        {/* Message Text Below the Image */}
        {message && <p className="m-0">{message}</p>}
      </div>
    </div>
  );
}


export default ChatBox;