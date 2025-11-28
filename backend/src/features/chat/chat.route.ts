import express from "express";
import ChatController from "./chat.controller.js";

const router = express.Router();

router.post("/", ChatController.createOrAppendChat);
router.get("/user/:userId", ChatController.getUserChats);
router.get("/:chatId", ChatController.getChatById);
router.delete("/:chatId", ChatController.deleteChat);

export default router;
