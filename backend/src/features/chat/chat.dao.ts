import Chat from "./chat.model.js";

const chatDao = {
  // Create a new chat
  createChat: async (userId, message) => {
    const chat = await Chat.create({
      userId,
      title: message.content.slice(0, 30),
      messages: [message],
    });
    return chat;
  },

  // Add a message to existing chat
  addMessage: async (chatId, message) => {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    chat.messages.push(message);
    await chat.save();
    return chat;
  },

  // Get all chats for a user
  getChatsByUser: async (userId) => {
    return Chat.find({ userId }).sort({ updatedAt: -1 });
  },

  // Get chat by ID
  getChatById: async (chatId) => {
    return Chat.findById(chatId);
  },

  // Delete chat
  deleteChat: async (chatId) => {
    return Chat.findByIdAndDelete(chatId);
  },
};

export default chatDao;
