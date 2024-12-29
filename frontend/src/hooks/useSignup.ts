import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

type SignupData = {
  fullname: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signUp = async (data: SignupData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const user = await res.json();

      if (!res.ok) {
        throw new Error(user.error);
      }

      setAuthUser(user);
    } catch (error: Error | any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    signUp
  }
}

export default useSignup;