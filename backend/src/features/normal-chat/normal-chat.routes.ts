import express from "express";
import NormalChatController from "./normal-chat.controller";

const router = express.Router();

router.post("/", NormalChatController.createOrAppendChat);
router.get("/user/:userId", NormalChatController.getUserChats);
router.get("/:chatId", NormalChatController.getChatById);
router.delete("/:chatId", NormalChatController.deleteChat);
router.post("/send", NormalChatController.sendChat);

export default router;
