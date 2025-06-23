import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { allConversationsList } from "../utils/authUtils";
import ChatUserDetails from "./ChatUserDetails";

function ChatBox() {
    const socketRef = useRef();
    const chatBoxRef = useRef();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // const BASE_URL = import.meta.env.CHAT_URL; 
    const BASE_URL = "https://backend.rmmbr.me/";
    const token = localStorage.getItem("token");
    const savedUserDetails = localStorage.getItem("userData");
    console.log("User Details", token)
    console.log("User", savedUserDetails);

    useEffect(() => {
        const loadMessages = async () => {
            const initialMessages = await allConversationsList();
            console.log("Initial Messages", initialMessages);
            // const selectedMessages =
            //     initialMessages.conversation.find((item) => item.userDetails._id === user._id)?.messages || [];
            // const selectedMessages =
            //     initialMessages.conversation.find((item) => item.userDetails?._id === user._id)?.messages || [];
            // console.log("Selected Messages", selectedMessages);
            setMessages(initialMessages.conversation || []);
        };

        loadMessages();

        const socket = io(BASE_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token: token,
            },
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
    }, [BASE_URL, user]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if ((message.trim() || imageFile) && socketRef.current) {

            const newMessage = {
                text: message.trim(),
                sender: storedUser?._id,
                receiver: user._id,
                msgByUserId: storedUser?._id,
            };

            if (socketRef.current.connected) {
                socketRef.current.emit("new message", newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessage("");
                setSelectedImage(null);
                setImageFile(null);
            } else {
                console.error("Socket is not connected!");
            }
        }
    };

    console.log("User Details in ChatBox", user);
    console.log("Messages", messages);

    return (
        <div className="container-fluid py-4 bg-white text-black" style={{ minHeight: "100vh" }}>
            <div className="row">
                <div className="col-md-4 border-end" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    {/* <ChatUserDetails user={user} /> */}
                    <ChatUserDetails />
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
                                imageUrl={msg.imageUrl}
                                isSender={msg.msgByUserId === storedUser?._id}
                                avatar="https://via.placeholder.com/40"
                            />
                        ))}
                    </div>

                    <div className="card-footer p-3 w-100">
                        <div className="d-flex align-items-center">
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
                </div>
            </div>
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
                {message && <p className="m-0">{message}</p>}
            </div>
        </div>
    );
}


export default ChatBox;