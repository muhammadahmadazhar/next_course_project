import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

// Define message types for TypeScript
type MessageSender = "USER" | "AGENT";

// interface ChatMessage {
//   id: string;
//   chatId: string;
//   content: string;
//   sender: MessageSender;
//   createdAt: Date;
//   agentId?: string;
// }

// Global storage for the Socket.IO server instance
let io: IOServer | null = null;

// Maps to track active connections
const activeAgents = new Map<string, string>(); // agentId -> socketId
const activeUsers = new Map<string, string>(); // sessionToken -> socketId

export function getSocketServer(httpServer: HttpServer): IOServer {
  if (!io) {
    // Create new Socket.IO server if not already initialized
    io = new IOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_SITE_URL 
          : ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Setup socket event handlers
    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      
      // Send a welcome message to confirm connection
      socket.emit('welcome', { message: 'Connection established' });
      
      // Handle user connection
      socket.on('userConnect', (sessionToken: string) => {
        if (!sessionToken) return;
        
        console.log('User connected with session token', sessionToken);
        activeUsers.set(sessionToken, socket.id);
        socket.join(`user-${sessionToken}`);
        socket.join(`chat-1`); // Join default chat room
      });
      
      // Handle agent connection
      socket.on('agentConnect', (agentId: string) => {
        if (!agentId) return;
        
        console.log('Agent connected:', agentId);
        socket.join(`agent-${agentId}`);
        socket.join('available-agents'); // Join the available agents room
        activeAgents.set(agentId, socket.id);
      });
      
      // Handle agent joining a chat
      socket.on('agentJoinChat', (data: { chatId: string, agentId: string }) => {
        const { chatId, agentId } = data;
        if (!chatId || !agentId) return;
        
        console.log('Agent joining chat:', chatId);
        socket.join(`${chatId}`);
        
        // Notify everyone in the chat that an agent has joined
        io!.to(`${chatId}`).emit('agentJoined', {
          chatId,
          agentId
        });
      });
      
      // Handle new messages
      socket.on('newMessage', (data: {
        chatId: string;
        content: string;
        sender: MessageSender;
        agentId?: string;
      }) => {
        const { chatId, content, sender, agentId } = data;
        
        if (!chatId || !content || !sender) {
          console.error('Missing required fields in newMessage event');
          return;
        }
        
        // Create a new message object (in a real app, you'd save this to a database)
        const message = {
          id: `msg-${Date.now()}`,
          chatId,
          content,
          sender,
          createdAt: new Date(),
          agentId: sender === 'AGENT' ? agentId : undefined
        };
        
        console.log('New message:', message);
        
        // Broadcast the message to everyone in the chat
        io!.to(`${chatId}`).emit('messageReceived', message);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        
        // Clean up any tracked connections
        for (const [key, value] of activeAgents.entries()) {
          if (value === socket.id) {
            console.log(`Agent ${key} disconnected`);
            activeAgents.delete(key);
            break;
          }
        }
        
        for (const [key, value] of activeUsers.entries()) {
          if (value === socket.id) {
            console.log(`User ${key} disconnected`);
            activeUsers.delete(key);
            break;
          }
        }
      });
    });

    console.log('Socket server initialized with chat support');
  }
  
  return io;
}