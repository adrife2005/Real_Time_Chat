import { useEffect, useState } from "react";
import { ConversationType } from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/messages/conversations')

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error)
        }

        setConversations(data);
      } catch (error: Error | any) {
        console.error(error?.message)
        toast.error(error?.message)
      } finally {
        setLoading(false);
      }
    }

    getConversations();
  }, [])

  return {loading, conversations}
}

export default useGetConversations;