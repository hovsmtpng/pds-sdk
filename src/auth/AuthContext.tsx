import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiCall } from "@/api/apiService";

const urlLobby: string = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN;

/* =======================
   Types
======================= */

interface UserData {
  nik: string;
  username: string;
  full_name: string;
  email: string;
  division?: string;
  department?: string;
  position?: string;
}

interface UserModule {
  role: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  auth: UserData | null;
  modules: UserModule | null;
  userRole: unknown;
  login: (userData: UserData, userModule: UserModule) => Promise<void>;
  logout: () => void;
  lobby: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* =======================
   Provider
======================= */

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<UserData | null>(null);
  const [modules, setModules] = useState<UserModule | null>(null);
  const [userRole, setUserRole] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("user_module");
    const savedModules = localStorage.getItem("modules");
    const savedUserRole = localStorage.getItem("user_role");

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth) as UserData);
      if (savedModules) {
        setModules(JSON.parse(savedModules) as UserModule);
      }
    }

    if (savedUserRole) {
      setUserRole(JSON.parse(savedUserRole));
    }

    setLoading(false);
  }, []);

  const postMapUserAccess = async (
    userData: UserData,
    userModule: UserModule
  ): Promise<unknown> => {
    const res = await apiCall("/api/mst/post-map-users-access", "POST", {
      npk: userData.nik,
      username: userData.username,
      fullname: userData.full_name,
      email: userData.email,
      role: userModule.role,
      division: userData.division,
      department: userData.department,
      position: userData.position,
    });

    return res;
  };

  const getUserRole = async (userData: UserData): Promise<any> => {
    const res = await apiCall("/api/mst/get-user-role", "POST", {
      npk: userData.nik,
    });
    return res;
  };

  const login = async (
    userData: UserData,
    userModule: UserModule
  ): Promise<void> => {
    localStorage.setItem("user_module", JSON.stringify(userData));
    localStorage.setItem("modules", JSON.stringify(userModule));

    await postMapUserAccess(userData, userModule);

    await getUserRole(userData).then((res) => {
      localStorage.setItem("user_role", JSON.stringify(res.data));
      setUserRole(res.data);
    });

    setAuth(userData);
    setModules(userModule);
  };

  const logout = (): void => {
    localStorage.removeItem("user_module");
    localStorage.removeItem("modules");
    localStorage.removeItem("user_role");

    setAuth(null);
    setModules(null);
    setUserRole(null);
  };

  const lobby = (): void => {
    logout();
    localStorage.removeItem("selected-role");
    window.location.href = urlLobby;
  };

  return (
    <AuthContext.Provider value={{ auth, modules, userRole, login, logout, lobby }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

export const useAuth = (): AuthContextValue => {
  const ctx = React.useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};
