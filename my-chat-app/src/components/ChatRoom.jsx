import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Moment from 'react-moment';
import { io } from "socket.io-client";

const ChatRoom = () => {
    const location = useLocation();
    const [data, setData] = useState({});
    const [msg, setMsg] = useState("");
    const [allMsg, setAll] = useState([]);
    const [socket, setSocket] = useState();
    const msgBoxRef = useRef();

    useEffect(() => {
        const socket = io("http://localhost:8000");
        setSocket(socket);
        socket.on("connect", () => {
            // console.log(socket.id);
            socket.emit("joinRoom", location.state.room);
        });
    }, [])

    useEffect(() => {
        setData(location.state);
    }, [location]);

    useEffect(() => {
        if (socket) {
            socket.on("getLatestMessage", newMsg => {
                setAll([...allMsg, newMsg]);
                msgBoxRef.current.scrollIntoView({ behavior: "smooth" })
            })
        }
    }, [socket, allMsg])

    const handleChange = (e) => {
        setMsg(e.target.value);
    }
    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            onSubmit();
        }
    }

    const onSubmit = () => {
        if (msg) {
            const newMsg = {
                time: new Date(),
                msg,
                name: data.name
            }
            socket.emit("sendMessage", { newMsg, room: data.room });
        }
        setMsg("");
    }
    return (
        <>
            <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container">
                <div className="text-center px-3 mb-4 text-capitalize">
                    <h1 className="text-warning mb-4">{data.room} Chat Room</h1>
                </div>
                <div className="bg-light border rounded p-3 mb-4" style={{ height: "450px", overflow: "scroll" }}>
                    {allMsg.map((msg) => {
                        return data.name === msg.name
                            ?
                            <div className="row justify-content-end pl-5">
                                <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto ">
                                    <div>
                                        <strong className='m-1'>{msg.name}</strong>
                                        <small className='text-muted'><Moment fromNow>{msg.time}</Moment></small>
                                    </div>
                                    <h4 className='m-1'>{msg.msg}</h4>
                                </div>
                            </div>
                            :
                            <div className="row justify-content-start pl-5">
                                <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto">
                                    <div>
                                        <strong className='m-1'>{msg.name}</strong>
                                        <small className='text-muted m-1'><Moment fromNow>{msg.time}</Moment></small>
                                    </div>
                                    <h4 className='m-1'>{msg.msg}</h4>
                                </div>
                            </div>
                    })}
                    <div ref={msgBoxRef}></div>
                </div>
                <div className="form-group d-flex">
                    <input type="text" className='form-control bg-light' name='message' placeholder='Type your message' onChange={handleChange} value={msg} onKeyDown={handleEnter} />
                    <button type='button' className='btn btn-warning mx-2' onClick={onSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ChatRoom