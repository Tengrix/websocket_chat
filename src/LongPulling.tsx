import React, {ChangeEvent, useEffect, useState} from 'react';
import axios from 'axios';
interface IMessage {
    id:string;
    message:string[];
}
const LongPulling = () => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [query,setQuery] = useState('');

    const getMessages = async () => {
        try {
            const newMessages = await axios.get('http://localhost:7000/get-messages')
            setMessages(prev=>[...prev, newMessages.data])
            await getMessages()
        }catch (e) {
            setTimeout(()=>{
                getMessages()
            },500)
        }

    }
    useEffect(()=>{
        getMessages()
    },[])

    const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const sendMessage = async() => {
       await axios.post('http://localhost:7000/new-messages', {
           message:query,
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

export default LongPulling;