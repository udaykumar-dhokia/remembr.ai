import GeminiClient from "../../geminiClient";
import normalChatDao from "./normal-chat.dao";
import NormalChat from "./normal-chat.model";

const NormalChatController = {
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
        chat = await normalChatDao.addMessage(chatId, message);
      } else {
        // Create new chat
        chat = await normalChatDao.createChat(userId, message);
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
      const chats = await NormalChat.findOne({ userId });

      if (!chats) {
        return res.status(200).json({ messages: [] });
      }

      res.status(200).json({ messages: chats.messages });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats." });
    }
  },

  // Get single chat
  getChatById: async (req, res) => {
    const { chatId } = req.params;
    try {
      const chat = await normalChatDao.getChatById(chatId);
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
      await normalChatDao.deleteChat(chatId);
      res.status(200).json({ message: "Chat deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete chat." });
    }
  },

  sendChat: async (req, res) => {
    const { userId, content } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      let chat = await NormalChat.findOne({ userId });
      const lastFiveMessages = chat ? chat.messages.slice(-5) : [];
      const reply = await GeminiClient.sendMessage(content, lastFiveMessages);

      if (!chat) {
        chat = new NormalChat({ userId, messages: [] });
      }

      chat.messages.push(
        { role: "user", content },
        { role: "assistant", content: reply }
      );

      await chat.save();

      return res.status(200).json({ reply });
    } catch (error) {
      console.error("Error in sendChat:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default NormalChatController;
