import React, {ChangeEvent, useEffect, useState} from 'react';
import axios from 'axios';

export interface IMessage {
    id: string;
    message: string[];
    event?:any
}

const EventSourcing = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [query, setQuery] = useState('');

    useEffect(() => {
        getMessages()
    }, [])

    const getMessages = async () => {
        const eventSource = new EventSource('http://localhost:7000/connect')
        eventSource.onmessage = function (e) {
            const message = JSON.parse(e.data)
            setMessages(prev => [...prev, message])
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const sendMessage = async () => {
        await axios.post('http://localhost:7000/new-messages', {
            message: query,
            id: Date.now(),
        })
        setQuery('')
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
                                {mssg.message}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventSourcing;