import { createContext, Dispatch, ReactNode, SetStateAction, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

type AuthUserType = {
  id: string;
  fullname: string;
  email: string;
  profilePic: string;
  gender: string
}

interface AuthContextType {
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => { },
  isLoading: true,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setAuthUser(data);
      } catch (error: Error | any) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [])

  return (
    <AuthContext.Provider value={{
      authUser,
      isLoading,
      setAuthUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}