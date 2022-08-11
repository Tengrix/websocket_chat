import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {IMessage} from './EventSourcing';

interface IWebSockType {
    event:'connection';
    userName:string;
    id:string;
    message:string;
}

const WebSock = () => {
    const [messages, setMessages] = useState<IWebSockType[]>([])
    const [query, setQuery] = useState('');
    const [connected, setConnected] = useState(false);
    const [userName, setUserName] = useState('')
    const socket = useRef() as any


    function connect() {
        socket.current = new WebSocket('ws://localhost:7000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event:'connection',
                userName,
                id:Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (e:any) => {
            const message = JSON.parse(e.data)
            setMessages(prevState => [...prevState,message])
        }
        socket.current.onclose = () => {
            console.log('Socket is closed')

        }
        socket.current.onerror = () => {
            console.log('Socket error')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const sendMessage = async () => {
        const message = {
            userName,
            message:query,
            id:Date.now(),
            event:'message'
        }
        socket.current.send(JSON.stringify(message));
        setQuery('')
    }

    if (!connected) {
        return (
            <div>
                <div>
                    <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        type="text"
                        placeholder={'Please enter your name'}
                    />
                    <button onClick={connect}>Enter</button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div>
                <div>
                    <input value={query} onChange={onChangeHandler} type="text"/>
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div>
                    {messages.map(mssg =>
                        <div key={mssg.id}>
                            <div>
                                {mssg.event==='connection'
                                    ?<div>User {mssg.userName} have accessed</div>
                                    :<div>{mssg.userName}. {mssg.message}</div>
                                }

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;