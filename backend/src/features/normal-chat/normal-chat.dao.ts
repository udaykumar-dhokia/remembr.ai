import NormalChat from "./normal-chat.model";

const normalChatDao = {
  // Create a new chat
  createChat: async (userId, message) => {
    const chat = await NormalChat.create({
      userId,
      title: message.content.slice(0, 30),
      messages: [message],
    });
    return chat;
  },

  // Add a message to existing chat
  addMessage: async (chatId, message) => {
    const chat = await NormalChat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    chat.messages.push(message);
    await chat.save();
    return chat;
  },

  // Get all chats for a user
  getChatsByUser: async (userId) => {
    return NormalChat.find({ userId }).sort({ updatedAt: -1 });
  },

  // Get chat by ID
  getChatById: async (chatId) => {
    return NormalChat.findById(chatId);
  },

  // Delete chat
  deleteChat: async (chatId) => {
    return NormalChat.findByIdAndDelete(chatId);
  },
};

export default normalChatDao;
