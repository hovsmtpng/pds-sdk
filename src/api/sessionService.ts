import axios, { type AxiosResponse } from "axios";
import Swal from "sweetalert2";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { base64DecodeWithSecret } from "../utils/base64DecodeWithSecret";

interface DecodedUser {
    username: string;
    session_token: string;
    [key: string]: any;
}

interface DecodedModule {
    module: string;
    [key: string]: any;
}

type LoginFn = (user: DecodedUser, module: DecodedModule) => void;

const formatTimestamp = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(date);

    const year = parts.find((part) => part.type === "year")!.value;
    const month = parts.find((part) => part.type === "month")!.value;
    const day = parts.find((part) => part.type === "day")!.value;
    const hour = parts.find((part) => part.type === "hour")!.value;
    const minute = parts.find((part) => part.type === "minute")!.value;
    const second = parts.find((part) => part.type === "second")!.value;

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const handleSessionError = (): void => {
    const urlLobby = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN as string;
    Swal.fire({
        title: "Akses anda tidak aktif",
        icon: "warning",
        confirmButtonText: "OK",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = urlLobby;
        }
    });
};

const validateSession = async (
    decodedUser: DecodedUser,
    decodedModule: DecodedModule,
    login: LoginFn
): Promise<void> => {
    const timestamp = formatTimestamp(new Date());
    const keySsoPuninar = import.meta.env.VITE_KEY_SSO_PUNINAR as string;
    const keyPun = SHA256(`${keySsoPuninar}${timestamp}`).toString(Hex);

    try {
        const response: AxiosResponse<any> = await axios.post(
            import.meta.env.VITE_URL_SSO_CHECK_GENERAL_USER as string,
            {
                username: decodedUser.username,
                session_token: decodedUser.session_token,
                param: {
                    module: decodedModule.module,
                    key_module: import.meta.env.VITE_KEY_MODULE,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "key-puninar": keyPun,
                    timestamp,
                },
            }
        );

        if (!response.data.success) {
            throw new Error("Session invalid");
        }

        localStorage.setItem("user_module", JSON.stringify(decodedUser));
        localStorage.setItem("modules", JSON.stringify(decodedModule));
        login(decodedUser, decodedModule);
    } catch (error) {
        console.log(error, "error 78");
        handleSessionError();
    }
};

export const handleLogout = async (): Promise<void> => {
    let storedUser: string | null = localStorage.getItem("user_module");

    if (storedUser) {
        storedUser = JSON.parse(storedUser);
    } else {
        console.log("No user found in localStorage");
        return;
    }

    const keySsoPuninar = import.meta.env.VITE_KEY_SSO_PUNINAR as string;
    const timestamp = formatTimestamp(new Date());

    const encryptionKey = `${keySsoPuninar}${timestamp}`;
    const keyPun = SHA256(encryptionKey).toString(Hex);

    const body = {
        username: (storedUser as any).username,
        session_token: (storedUser as any).session_token,
    };

    const response = await axios.post(
        (import.meta.env.VITE_URL_SSO as string) + "auth/logout",
        JSON.stringify(body),
        {
            headers: {
                "Content-Type": "application/json",
                "key-puninar": keyPun,
                timestamp: timestamp,
            },
        }
    );

    localStorage.clear();

    if (response.status === 200) {
        window.location.href = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN as string;
    } else {
        console.log(response);
    }
};

export const checkSession = async (
    location: Location,
    login: LoginFn
): Promise<void> => {
    if (location.pathname.startsWith("/public")) return;

    const params = new URLSearchParams(window.location.search);
    const secretKey = import.meta.env.VITE_KEY_STATIC as string;
    const userParam = params.get("user");
    const moduleParam = params.get("module");

    const storedUser = localStorage.getItem("user_module");
    const storedModules = localStorage.getItem("modules");

    if (storedUser && storedModules) {
        if (params.size === 0) return;

        try {
            if(!userParam || !moduleParam) return;
            const decodedUser = base64DecodeWithSecret(userParam, secretKey) as DecodedUser;
            const decodedModule = base64DecodeWithSecret(moduleParam, secretKey) as DecodedModule;

            if (
                decodedUser.username === JSON.parse(storedUser).username &&
                decodedModule.module === JSON.parse(storedModules).module
            ) {
                return;
            }

            await validateSession(decodedUser, decodedModule, login);
        } catch (error) {
            console.log(error, "error 141");
            handleSessionError();
        }
        return;
    }

    try {
        console.log(userParam, moduleParam);
        if(!userParam || !moduleParam) return;
        const decodedUser = base64DecodeWithSecret(userParam, secretKey) as DecodedUser;
        const decodedModule = base64DecodeWithSecret(moduleParam, secretKey) as DecodedModule;
        await validateSession(decodedUser, decodedModule, login);
    } catch (error) {
        console.log(error, "error 153");
        handleSessionError();
    }
};