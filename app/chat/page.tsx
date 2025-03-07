"use client"
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Define message types
type MessageSender = "USER" | "AGENT";

interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  sender: MessageSender;
  createdAt: Date;
  agentId?: string;
}

export default function ChatClient() {
  // Connection states
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<"user" | "agent" | null>(null);
  
  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [agentJoined, setAgentJoined] = useState(false);
  
  // Session info
  const sessionToken = "abc"; // Hardcoded as requested
  const agentId = "100";     // Hardcoded as requested
  const chatId = "chat-1";    // Hardcoded chat room
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io({
      path: "/api/socketio",
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setConnectionType(null);
      setAgentJoined(false);
    });

    socketInstance.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
    });

    socketInstance.on('welcome', (data: any) => {
      console.log('Received welcome message:', data);
    });

    // Message received event
    socketInstance.on('messageReceived', (message: ChatMessage) => {
      console.log('Message received:', message);
      
      // Add message to state and localStorage
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    // Agent joined event
    socketInstance.on('agentJoined', (data: { chatId: string, agentId: string }) => {
      console.log('Agent joined chat:', data);
      setAgentJoined(true);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        chatId: data.chatId,
        content: `Agent ${data.agentId} has joined the chat`,
        sender: "AGENT",
        createdAt: new Date(),
        agentId: data.agentId
      };
      
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, systemMessage];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    setSocket(socketInstance);

    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Error parsing saved messages', e);
      }
    }

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect as user
  const connectAsUser = () => {
    if (!socket || !isConnected) return;
    
    socket.emit('userConnect', sessionToken);
    setConnectionType('user');
    console.log(`Connected as user with session token: ${sessionToken}`);
  };

  // Connect as agent
  const connectAsAgent = () => {
    if (!socket || !isConnected) return;
    
    socket.emit('agentConnect', agentId);
    setConnectionType('agent');
    console.log(`Connected as agent with ID: ${agentId}`);
  };

  // Join chat as agent
  const joinChat = () => {
    if (!socket || !isConnected || connectionType !== 'agent') return;
    
    socket.emit('agentJoinChat', { chatId, agentId });
    console.log(`Agent ${agentId} joining chat: ${chatId}`);
  };

  // Send message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !isConnected || !newMessage.trim() || !connectionType) return;
    
    const messageData = {
      chatId,
      content: newMessage,
      sender: connectionType === 'user' ? 'USER' as MessageSender : 'AGENT' as MessageSender,
      agentId: connectionType === 'agent' ? agentId : undefined
    };
    
    socket.emit('newMessage', messageData);
    console.log('Sending message:', messageData);
    setNewMessage("");
  };

  // Clear chat history
  const clearChat = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Socket.IO Chat Client</h1>
      
      {/* Connection Status */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg">
        <p>Socket Status: <span className={isConnected ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span></p>
        {connectionType && <p>Connected as: <span className="font-medium">{connectionType}</span></p>}
        {connectionType === 'agent' && agentJoined && <p>Joined chat: {chatId}</p>}
      </div>
      
      {/* Connection Controls */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={connectAsUser}
          disabled={!isConnected || !!connectionType} 
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Connect as User (token: {sessionToken})
        </button>
        <button 
          onClick={connectAsAgent}
          disabled={!isConnected || !!connectionType} 
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Connect as Agent (ID: {agentId})
        </button>
        {connectionType === 'agent' && !agentJoined && (
          <button 
            onClick={joinChat}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Join Chat
          </button>
        )}
      </div>
      
      {/* Chat Interface */}
      <div className="border rounded-lg overflow-hidden mb-4">
        {/* Messages Display */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center my-10">No messages yet</p>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-4 ${message.sender === 'USER' ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block p-3 rounded-lg max-w-xs ${
                  message.sender === 'USER' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-green-100 text-green-900'
                }`}>
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.sender === 'AGENT' && message.agentId && `Agent ${message.agentId} • `}
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <form onSubmit={sendMessage} className="border-t p-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected || !connectionType}
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!isConnected || !connectionType || !newMessage.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300"
          >
            Send
          </button>
        </form>
      </div>
      
      {/* Debug Controls */}
      <div className="flex justify-between">
        <button 
          onClick={clearChat}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Chat History
        </button>
        
        <button 
          onClick={() => socket?.disconnect()}
          disabled={!isConnected}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}