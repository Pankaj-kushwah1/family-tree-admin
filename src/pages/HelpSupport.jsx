import { useEffect, useRef, useState } from "react";
import { allConversationsList } from "../utils/authUtils";
import { io } from "socket.io-client";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const HelpSupport = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    // const BASE_URL = "http://localhost:3001";
    const BASE_URL = "https://backend.rmmbr.me/";
    const ADMIN_ID = "681e3db3e4adeb7a1bfa84c2"

    const messagesEndRef = useRef(null);

    const socketRef = useRef();

    const groupMessagesByDate = (messages) => {
        return messages.reduce((groups, message) => {
            const dateKey = message.createdAt
                ? format(parseISO(message.createdAt), "yyyy-MM-dd")
                : "unknown";

            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(message);
            return groups;
        }, {});
    };

    const formatDateLabel = (dateStr) => {
        const dateObj = parseISO(dateStr);
        if (isToday(dateObj)) return "Today";
        if (isYesterday(dateObj)) return "Yesterday";
        return format(dateObj, "dd-MM-yyyy");
    };


    useEffect(() => {
        const fetchConversations = async () => {
            setLoading(true);
            try {
                const res = await allConversationsList();
                if (res.success) {
                    console.log("Response", res);

                    setUsers(res.conversation);
                    if (res.conversation.length > 0) {
                        const firstUser = res.conversation[0].userDetails;
                        setSelectedUser(firstUser);
                        setSelectedUserId(firstUser._id);
                        setMessages(res.conversation[0].messages || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
        console.log("Starting socket connection setup...");
        console.log("Token being used:", token);
        if (!token) return;

        // socketRef.current = io(BASE_URL, {
        //     transports: ["websocket"],
        // });

        // console.log("Socket initialized:", socketRef.current);

        // socketRef.current.on("connect", () => {
        //     console.log("✅ Admin connected to socket. ID:", socketRef.current.id);
        //     socketRef.current.emit("join admin", ADMIN_ID);
        // });

        // socketRef.current.on("disconnect", (reason) => {
        //     console.warn("⚠️ Socket disconnected:", reason);
        // });

        // socketRef.current.on("message received", (msg) => {
        //     console.log("Message received:", msg);
        //     setMessages((prev) => [...prev, msg]);
        // });

        // socketRef.current.on("connect_error", (err) => {
        //     console.error("❌ Connection error:", err.message);
        // });

        const socket = io(BASE_URL, {
            transports: ["websocket"],
        });

        console.log("Socket initialized:", socket);

        socket.on("connect", () => {
            console.log("✅ Admin connected to socket. ID:", socket.id);
            socket.emit("join admin", ADMIN_ID);
        });

        socket.on("disconnect", (reason) => {
            console.warn("⚠️ Socket disconnected:", reason);
        });

        socket.on("message received", (msg) => {
            console.log("Message received:", msg);
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Connection error:", err.message);
        });

        socketRef.current = socket;

        return () => {
            console.log("Disconnecting socket...");
            // socketRef.current.disconnect();
            socket.disconnect();
        };
    }, [BASE_URL, users, token]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleUserClick = (userId) => {
        const selectedConversation = users.find(conv => conv.userDetails._id === userId);

        if (selectedConversation) {
            setSelectedUserId(userId);
            setSelectedUser(selectedConversation.userDetails);
            setMessages(selectedConversation.messages || []);
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msgPayload = {
            msgByUserId: ADMIN_ID,
            sender: ADMIN_ID,
            receiver: selectedUserId,
            text: newMessage.trim(),
            createdAt: new Date().toISOString(),
        };

        console.log("Preparing to send message:", msgPayload);

        if (socketRef.current) {
            console.log("Sending message payload:", msgPayload);

            socketRef.current.emit("new message", msgPayload);
            setMessages((prev) => [...prev, msgPayload]);
            setNewMessage("");
        } else {
            console.error("Socket is not initialized.");
        }
    };

    return (
        <div className="container-fluid py-4 bg-white text-black" style={{ minHeight: "100vh" }}>
            <div className="row">
                <div className="col-md-4 border-end" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                    {users.map((item, index) => (
                        <div
                            key={`${item.userDetails._id}-${index}`}
                            className={`activity-item p-3 cursor-pointer ${selectedUserId === item.userDetails._id ? 'bg-light border' : ''
                                }`}
                            onClick={() => handleUserClick(item.userDetails._id)}
                        >
                            <img
                                src={item?.userDetails.profileImageUrl}
                                alt={item?.userDetails.fullName}
                                style={{
                                    height: "47px",
                                    width: "55px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                }}
                            />
                            <div className="ms-2 d-inline-block align-middle w-100">
                                <div className="fw-bold text-truncate d-flex justify-content-between align-items-center">
                                    <div style={{ fontSize: '14px', fontWeight: "500" }}>{item.userDetails.fullName}</div>
                                    <div style={{ fontSize: '12px' }}>{item.userDetails.email}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-md-8 d-flex flex-column" style={{ height: "90vh" }}>
                    {selectedUser ? (
                        <>
                            <div
                                className="border-bottom p-3"
                                style={{ fontWeight: "600", fontSize: "18px", backgroundColor: "#f8f8f8" }}
                            >
                                Chat with {selectedUser.fullName}
                            </div>

                            <div
                                className="flex-grow-1 p-3"
                                style={{ backgroundColor: "#e5ddd5", borderRadius: "0 0 10px 10px", overflowY: 'auto' }}
                            >
                                {messages.length === 0 && <p>No messages yet. Say hi!</p>}

                                {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div
                                            className="text-center my-3"
                                            style={{
                                                fontWeight: "600",
                                                color: "#555",
                                                backgroundColor: "#e0e0e0",
                                                borderRadius: "20px",
                                                padding: "4px 12px",
                                                width: "fit-content",
                                                margin: "0 auto",
                                            }}
                                        >
                                            {formatDateLabel(date)}
                                        </div>

                                        {msgs.map((msg, i) => {
                                            const isAdmin = msg.msgByUserId === ADMIN_ID;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`d-flex mb-2 ${isAdmin ? "justify-content-end" : "justify-content-start"}`}
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth: "70%",
                                                            backgroundColor: isAdmin ? "#dcf8c6" : "white",
                                                            padding: "8px 12px",
                                                            borderRadius: "15px",
                                                            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                                                        }}
                                                    >
                                                        {msg.text}
                                                        <div style={{ fontSize: 10, color: "#999", marginTop: 4, textAlign: "right" }}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-3 border-top d-flex" style={{ gap: "10px" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button className="btn btn-primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <p>Select a user to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
