import chatDao from "./chat.dao.js";

const ChatController = {
  // Create a new chat or add message to existing chat
  createOrAppendChat: async (req, res) => {
    const { chatId, userId, role, content } = req.body;

    if (!userId || !role || !content) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const message = { role, content };

    try {
      let chat;
      if (chatId) {
        // Append message to existing chat
        chat = await chatDao.addMessage(chatId, message);
      } else {
        // Create new chat
        chat = await chatDao.createChat(userId, message);
      }
      res.status(200).json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create or update chat." });
    }
  },

  // Get all chats for a user
  getUserChats: async (req, res) => {
    const { userId } = req.params;
    try {
      const chats = await chatDao.getChatsByUser(userId);
      res.status(200).json(chats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch chats." });
    }
  },

  // Get single chat
  getChatById: async (req, res) => {
    const { chatId } = req.params;
    try {
      const chat = await chatDao.getChatById(chatId);
      if (!chat) return res.status(404).json({ message: "Chat not found." });
      res.status(200).json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch chat." });
    }
  },

  // Delete chat
  deleteChat: async (req, res) => {
    const { chatId } = req.params;
    try {
      await chatDao.deleteChat(chatId);
      res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete chat." });
    }
  },
};

export default ChatController;
