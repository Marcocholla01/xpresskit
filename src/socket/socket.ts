import http from 'http';

import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

import expressApp from '../app';

interface MessageStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
  senderId: string;
  receiverId: string;
}

const userSocketMap: Record<string, string> = {};
const typingStatusMap: Record<string, { isTyping: boolean; toUserId?: string }> = {};
const activeConnections = new Set<string>();

const socketServer = http.createServer(expressApp);

const io = new Server(socketServer, {
  cors: {
    origin: [],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// 🔌 Enable admin UI
instrument(io, {
  auth: false,
  mode: 'development',
});

// Helper
const emitToUser = (userId: string, event: string, data: any) => {
  const socketId = userSocketMap[userId];
  if (socketId) io.to(socketId).emit(event, data);
};

io.on('connection', socket => {
  const socketId = socket.id;
  const userId = socket.handshake.query.userId as string;

  console.log(`✅ Socket connected: ${socketId}`);
  activeConnections.add(socketId);

  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socketId;
    socket.broadcast.emit('userOnlineStatus', { userId, isOnline: true });
  }

  io.emit('onlineUsersUpdate', getOnlineUsers());

  // 🧾 Client logs
  socket.on('client-log', (log, callback) => {
    try {
      console.log('📥 Client log:', log);
      io.emit('new-log', log);
      callback?.({ status: 'success' });
    } catch (error: any) {
      callback?.({ status: 'error', error: error.message });
    }
  });

  // ✅ Mark as seen
  socket.on('markMessagesAsSeen', ({ messageIds, senderId }, callback) => {
    try {
      emitToUser(senderId, 'messagesRead', {
        messageIds,
        readerId: userId,
        timestamp: new Date(),
      });
      callback?.({ status: 'success' });
    } catch (error: any) {
      callback?.({ status: 'error', error: error.message });
    }
  });

  // ✅ Confirm delivery
  socket.on('confirmMessageDelivery', ({ messageId, receiverId }, callback) => {
    try {
      emitToUser(receiverId, 'messageDelivered', {
        messageId,
        timestamp: new Date(),
      });
      callback?.({ status: 'success' });
    } catch (error: any) {
      callback?.({ status: 'error', error: error.message });
    }
  });

  // ✍ Typing status
  socket.on('typingStatus', ({ isTyping, toUserId }, callback) => {
    try {
      if (userId) {
        typingStatusMap[userId] = { isTyping, toUserId };
        if (toUserId) {
          emitToUser(toUserId, 'typingUpdate', { userId, isTyping });
        }
      }
      callback?.({ status: 'success' });
    } catch (error: any) {
      callback?.({ status: 'error', error: error.message });
    }
  });

  // 🔌 Disconnect
  socket.on('disconnect', reason => {
    console.log(`❌ Socket disconnected (${reason}): ${socketId}`);
    activeConnections.delete(socketId);

    if (userId) {
      delete userSocketMap[userId];
      delete typingStatusMap[userId];

      setTimeout(() => {
        if (!activeConnections.has(socketId)) {
          socket.broadcast.emit('userOnlineStatus', {
            userId,
            isOnline: false,
          });
        }
      }, 5000);
    }

    io.emit('onlineUsersUpdate', getOnlineUsers());
  });

  socket.on('error', error => {
    console.error(`🔥 Socket error (${socketId}):`, error);
  });
});

// 📤 Send message with tracking
const sendMessageWithStatus = ({
  senderId,
  receiverId,
  messageId,
  content,
}: {
  senderId: string;
  receiverId: string;
  messageId: string;
  content: any;
}) => {
  const timestamp = new Date();
  const receiverSocket = userSocketMap[receiverId];
  const senderSocket = userSocketMap[senderId];

  if (senderSocket) {
    io.to(senderSocket).emit('newMessage', {
      ...content,
      messageId,
      status: 'sent',
      timestamp,
    });
  }

  if (receiverSocket) {
    io.to(receiverSocket).emit('newMessage', {
      ...content,
      messageId,
      status: 'delivered',
      timestamp,
    });

    if (senderSocket) {
      io.to(senderSocket).emit('messageStatusUpdate', {
        messageId,
        status: 'delivered',
        timestamp,
      });
    }
  } else if (senderSocket) {
    io.to(senderSocket).emit('messageStatusUpdate', {
      messageId,
      status: 'sent',
      timestamp,
    });
  }
};

// 🧠 Utilities
const getOnlineUsers = () => Object.keys(userSocketMap);
const isUserOnline = (userId: string) => !!userSocketMap[userId];
const getReceiverSocketId = (receiverId: string) => userSocketMap[receiverId];

const emitLog = (log: any) => {
  io.emit('new-log', log);
};

export {
  emitLog,
  expressApp,
  getOnlineUsers,
  getReceiverSocketId,
  io,
  isUserOnline,
  sendMessageWithStatus,
  socketServer,
};
