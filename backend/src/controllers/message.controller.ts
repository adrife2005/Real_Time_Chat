import { Request, Response } from 'express';
import prisma from '../db/prisma';

// @desc Send a message
// @route POST /api/messages/send/:id
// @access Private
export const sendMessage = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const { id: senderId } = req.user;

    console.log("receiverId: ", receiverId);

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantsId: {
          hasEvery: [senderId, receiverId]
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantsId: {
            set: [senderId, receiverId]
          }
        }
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      }
    })

    if (newMessage) {
      conversation = await prisma.conversation.update({
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
      })
    }

    return res.status(201).json(newMessage);

  } catch (error: Error | any) {
    console.error("Error in sendMessage controller: ", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// @desc Get messages for a conversation
// @route GET /api/messages/:id
// @access Private
export const getMessages = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { id: receiverUserId } = req.params;
    const { id: senderUserId } = req.user;

    const conversation = await prisma.conversation.findFirst({
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
    })

    if (!conversation) {
      return res.status(404).json({ error: 'No conversation found' });
    }

    return res.status(200).json(conversation.messages)

  } catch (error: Error | any) {
    console.error("Error in getMessages controller: ", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// @desc Get users for conversation
// @route GET /api/messages/conversations
// @access Private
export const getUsersForConversation = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { id: authUserId } = req.user;

    const users = await prisma.user.findMany({
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
    })

    res.status(200).json(users)
  } catch (error: Error | any) {
    console.error("Error in getUsersForConversation controller: ", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
 }