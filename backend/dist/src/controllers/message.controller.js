"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForConversation = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const socket_1 = require("../socket/socket");
// @desc Send a message
// @route POST /api/messages/send/:id
// @access Private
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const { id: senderId } = req.user;
        console.log("receiverId: ", receiverId);
        let conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantsId: {
                    hasEvery: [senderId, receiverId]
                }
            }
        });
        if (!conversation) {
            conversation = yield prisma_1.default.conversation.create({
                data: {
                    participantsId: {
                        set: [senderId, receiverId]
                    }
                }
            });
        }
        const newMessage = yield prisma_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            }
        });
        if (newMessage) {
            conversation = yield prisma_1.default.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            });
        }
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        return res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.sendMessage = sendMessage;
// @desc Get messages for a conversation
// @route GET /api/messages/:id
// @access Private
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: receiverUserId } = req.params;
        const { id: senderUserId } = req.user;
        const conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantsId: {
                    hasEvery: [senderUserId, receiverUserId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        if (!conversation) {
            return res.status(404).json({ error: 'No conversation found' });
        }
        return res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getMessages = getMessages;
// @desc Get users for conversation
// @route GET /api/messages/conversations
// @access Private
const getUsersForConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: authUserId } = req.user;
        const users = yield prisma_1.default.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error in getUsersForConversation controller: ", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUsersForConversation = getUsersForConversation;
