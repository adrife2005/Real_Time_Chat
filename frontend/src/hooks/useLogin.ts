import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

type LoginInputs = {
  username: string;
  password: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (inputs: LoginInputs) => {
    try {
      setLoading(true);
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(inputs),
      });

      const data = await res.json();

      console.log(data);

			if (!res.ok) {
				throw new Error(data.error);
      }

      setAuthUser(data);
    } catch (error: Error | any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading
  }
}

export default useLogin;