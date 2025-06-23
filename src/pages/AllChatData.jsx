import { useState } from 'react';
import ChatBox from '../components/ChatBox'
import ChatList from '../components/ChatList'

const AllChatData = () => {

    // const [selectedUserId, setSelectedUserId] = useState(null);

    // const handleSelectUser = (userId) => {
    //     setSelectedUserId(userId);
    //     console.log("userId", userId);
    // };

    return (
        <div className='row height-after-nav'>
            {/* <ChatBox /> */}
            {/* <div className='col-md-8'>
                <div className="d-flex align-items-center justify-content-center h-100 bg_secondary border_r_16 p-3 text-center"> */}
            {/* {
                        selectedUserId ?
                            <ChatBox user={selectedUserId} />
                            :
                            <h4 className='fw-400'>
                                Your chat list is currently empty. <br />
                                Start a conversation.
                            </h4>
                    } */}
            {/* </div>
            </div> */}
        </div>
    )
}

export default AllChatData