import { create } from 'zustand'

export type ConversationType = {
  id: string
  fullname: string
  profilePic: string
}

export type MessageType = {
  id: string
  body: string
  senderId: string
  createdAt: string
}

interface ConversationState {
  messages: MessageType[]
  selectedConversation: ConversationType | null
  setMessages: (messages: MessageType[]) => void
  setSelectedConversation: (conversation: ConversationType | null) => void
}

const useConversation = create<ConversationState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  selectedConversation: null,
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}))

export default useConversation;