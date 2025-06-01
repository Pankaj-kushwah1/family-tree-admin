import { useEffect, useRef, useState } from 'react';
import { allConversationsList } from '../utils/authUtils';

const HelpSupport = () => {
    const [reportData, setReportData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [showAll, setShowAll] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sortedMessages = [...messages].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id || 0);
        const dateB = new Date(b.createdAt || b.id || 0);
        return dateA - dateB;
    });

    const allConversation = async () => {
        try {
            setLoading(true);
            const res = await allConversationsList();
            if (res.success) {
                setReportData(res.conversation);
                if (res.conversation.length > 0) {
                    setSelectedUserId(res.conversation[0].userDetails._id);
                    setMessages(res.conversation[0].messages || []);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        allConversation();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle clicking user on left pane
    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
        // Find messages for this user
        // const userConversation = reportData.find(user => user._id === userId);
        const userConversation = reportData.find(user => user.userDetails?._id === userId);

        if (userConversation) {
            setMessages(userConversation.messages || []);
        }
    };

    // Handle sending new message
    const handleSend = () => {
        if (newMessage.trim() === '') return;

        const now = new Date();
        const newMsg = {
            from: 'me',
            text: newMessage,
            date: now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            createdAt: now.toISOString(),
            id: Date.now()
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    };

    const visibleUsers = showAll
        ? reportData
        : reportData
            .filter(item => item.messages?.length > 0)
            .sort((a, b) => {
                const aTime = new Date(a.messages?.[a.messages.length - 1]|| 0);
                const bTime = new Date(b.messages?.[b.messages.length - 1] || 0);
                return bTime - aTime;
            })
            .slice(0, 10);

    console.log("reportData", reportData);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span class="loader"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-white text-black" style={{ minHeight: '100vh' }}>
            <div className="row">
                <div className="col-md-4">
                    <div className="activity-card">
                        {visibleUsers.map((item) => {
                            const messages = item.messages || [];
                            const lastMessage = messages[messages.length - 1];
                            const lastMessageText = lastMessage?.text || "No messages yet";
                            const formattedTime = lastMessage?.createdAt
                                ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                                : '';

                            return (
                                <div
                                    key={item._id}
                                    className={`activity-item p-3 cursor-pointer ${selectedUserId === item._id ? 'bg-light border' : ''}`}
                                    onClick={() => handleUserClick(item?.userDetails._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        style={{ height: "47px", width: "55px", objectFit: "cover", borderRadius: "50%" }}
                                        src={item?.userDetails.profileImageUrl}
                                        alt={`${item?.userDetails.fullName}'s avatar`}
                                    />
                                    <div className="ms-2 d-inline-block align-middle w-100" style={{ marginLeft: "10px" }}>
                                        <div className="fw-bold text-truncate d-flex justify-content-between align-items-center" style={{ fontSize: "14px" }}>
                                            <div style={{ fontSize: '14px', fontWeight: "500" }}>{item?.userDetails.fullName || "Unknown"}</div>
                                            <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{formattedTime}</div>
                                        </div>
                                        <div className="small text-muted text-truncate" style={{ maxWidth: '100%' }}>
                                            <div style={{ fontSize: "10px" }}>{lastMessageText}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* View All Button */}
                        {!showAll && reportData.length !== visibleUsers.length && (
                            <div className="text-center mt-3">
                                <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowAll(true)}>
                                    View All Users
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right pane - chat */}
                <div className="col-md-8 my-4">
                    <div className="bg-white rounded shadow p-3" style={{ maxWidth: '700px', margin: '0 auto', minHeight: "450px", display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                            <div className="d-flex align-items-center gap-2">
                                {(() => {
                                    const user = reportData.find(u => u.userDetails?._id === selectedUserId);
                                    return (
                                        <>
                                            <img
                                                src={user?.userDetails?.profileImageUrl || `https://i.pravatar.cc/40?u=${selectedUserId}`}
                                                alt="avatar"
                                                className="rounded-circle me-2"
                                                style={{ width: '40px', height: '40px' }}
                                            />
                                            <div className='ml-3'>
                                                <div className="fw-semibold text-dark" style={{ fontWeight: "bold", fontSize: "14px" }}>
                                                    {user?.userDetails?.fullName || "Select a chat"}
                                                </div>
                                                <div className="text-muted small" style={{ fontSize: "10px" }}>
                                                    {user?.userDetails?.city || ""}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow-1 overflow-auto py-3 px-2" style={{ fontSize: '14px' }}>
                            {messages.length === 0 && (
                                <div className="text-center text-muted">No messages to show</div>
                            )}
                            {sortedMessages.map((msg, idx) => {
                                const msgTime = msg.createdAt
                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })
                                    : '';

                                const showDateSeparator =
                                    idx === 0 || sortedMessages[idx - 1].date !== msg.date;

                                return (
                                    <div key={msg._id || idx}>
                                        {showDateSeparator && (
                                            <div className="text-center text-muted small mb-2">{msg.date}</div>
                                        )}
                                        <div className={`d-flex ${msg.from === 'me' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                                            {msg.from !== 'me' && (
                                                <img
                                                    src={
                                                        reportData.find(u => u.userDetails?._id === selectedUserId)?.userDetails?.profileImageUrl ||
                                                        `https://i.pravatar.cc/30?u=${selectedUserId}`
                                                    }
                                                    alt="avatar"
                                                    className="rounded-circle me-2"
                                                    style={{ width: '25px', height: '25px' }}
                                                />
                                            )}
                                            <div className="d-flex flex-column" style={{ maxWidth: '75%' }}>
                                                <div
                                                    className={`px-3 py-2 rounded-pill ${msg.from === 'me' ? 'bg-primary text-white align-self-end' : 'bg-light text-dark'}`}
                                                >
                                                    {msg.text}
                                                </div>
                                                <small className={`text-muted mt-1 ${msg.from === 'me' ? 'text-end' : ''}`} style={{ fontSize: '10px' }}>
                                                    {msgTime}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input */}
                        <div className="border-top pt-2 d-flex align-items-center gap-2">
                            <input
                                type="text"
                                className="form-control rounded-pill px-3"
                                placeholder="Aa"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="btn btn-primary" onClick={handleSend}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
