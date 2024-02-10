"use client"
import { useWebSocket } from 'next-ws/client';
import { useEffect, useState } from 'react';

interface ClientMessage {
  id: string;
  text: string;
}

export default function Page() {
  const ws = useWebSocket();
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ClientMessage[]>([]);
  const [clientConnections, setClientConnections] = useState<Set<WebSocket>>(new Set());

  useEffect(() => {
    if (!ws) return;

    const newWs = new WebSocket('ws://localhost:3000/api/ws'); // Adjust URL as per your WebSocket server
    newWs.addEventListener('open', () => {
      console.log('WebSocket connected');
      setClientConnections((prevConnections:any) => new Set([...prevConnections, newWs]));
    });
    newWs.addEventListener('message', onMessage);
    newWs.addEventListener('close', () => {
      console.log('WebSocket disconnected');
      setClientConnections((prevConnections) => {
        prevConnections.delete(newWs);
        return new Set(prevConnections);
      });
    });

    return () => {
      newWs.close();
    };
  }, [ws]);

  const onMessage = async (event: MessageEvent<Blob>) => {
    const messageText = await event.data.text();
    const newMessage: ClientMessage = { id: generateId(), text: messageText };
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    broadcastMessage(newMessage);
  };

  const broadcastMessage = (newMessage: ClientMessage) => {
    clientConnections.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });
  };

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const sendMessage = () => {
    if (!ws) return;
    const newMessage: ClientMessage = { id: generateId(), text: value };
    setConversation((prevConversation) => [...prevConversation, newMessage]);
    broadcastMessage(newMessage);
    setValue('');
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button onClick={sendMessage}>Send message to server</button>
      <p>
        {message === null
          ? 'Waiting to receive message...'
          : `Got message: ${message}`}
      </p>
      <div>
        <h3>Conversation</h3>
        <ul>
          {conversation.map((msg, index) => (
            <li key={msg.id}>{msg.text}</li>
          ))}
        </ul>
      </div>
    </>
  );
}





