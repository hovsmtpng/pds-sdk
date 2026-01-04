import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import log from "./log";
import Swal from "sweetalert2";
import { base64DecodeWithSecret } from "./base64DecodeWithSecret";

interface DecodedUser {
  username: string;
  session_token: string;
  [key: string]: any;
}

interface DecodedModule {
  module: string;
  [key: string]: any;
}

const useSessionCheck = () => {
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      const userRaw = sessionStorage.getItem("user_module");
      const modulesRaw = sessionStorage.getItem("modules");

      const user = userRaw ? JSON.parse(userRaw) : null;
      const modules = modulesRaw ? JSON.parse(modulesRaw) : null;
      const secretKey = import.meta.env.VITE_KEY_STATIC as string;
      const urlLobby = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN as string;
      const keySsoPuninar = import.meta.env.VITE_KEY_SSO_PUNINAR as string;

      if (user && modules) {
        const body = {
          session_token: user.session_token,
          username: user.username,
        };

        const timestamp = formatTimestamp(new Date());
        const encryptionKey = `${keySsoPuninar}${timestamp}`;
        const keyPun = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(encryptionKey)
        );

        const keyPunArray = new Uint8Array(keyPun);
        const keyPunHex = Array.from(keyPunArray)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        try {
          const response: AxiosResponse<any> = await axios.post(
            import.meta.env.VITE_URL_SSO_SESSION as string,
            body,
            {
              headers: {
                "Content-Type": "application/json",
                "key-puninar": keyPunHex,
                timestamp: timestamp,
              },
            }
          );

          if (!response.data.success) {
            Swal.fire({
              title: "Session anda tidak aktif",
              icon: "warning",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => {
                  window.location.href = urlLobby;
                }, 1000);
              }
            });

            setIsSessionValid(false);
          } else {
            setIsSessionValid(true);
          }
        } catch (error) {
          log.error("SSO session error:", error);
          setIsSessionValid(false);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get("user");
        const moduleParam = params.get("module");
        const keyModuleParam = params.get("key_module");

        if (!userParam || !moduleParam || !keyModuleParam) {
          Swal.fire({
            title: "Invalid request parameters",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                window.location.href = urlLobby;
              }, 1000);
            }
          });

          setIsSessionValid(false);
          return;
        }

        const decodedUser = base64DecodeWithSecret(userParam, secretKey) as DecodedUser;
        const decodedModule = base64DecodeWithSecret(moduleParam, secretKey) as DecodedModule;
        const decodedKeyModule = base64DecodeWithSecret(keyModuleParam, secretKey) as string;

        if (decodedKeyModule !== import.meta.env.VITE_KEY_MODULE) {
          Swal.fire({
            title: "Key module tidak valid",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                window.location.href = urlLobby;
              }, 1000);
            }
          });

          setIsSessionValid(false);
          return;
        }

        try {
          const body = {
            session_token: decodedUser.session_token,
            username: decodedUser.username,
          };

          const timestamp = formatTimestamp(new Date());
          const encryptionKey = `${keySsoPuninar}${timestamp}`;
          const keyPun = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(encryptionKey)
          );

          const keyPunArray = new Uint8Array(keyPun);
          const keyPunHex = Array.from(keyPunArray)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          const responseSession: AxiosResponse<any> = await axios.post(
            import.meta.env.VITE_URL_SSO_SESSION as string,
            body,
            {
              headers: {
                "Content-Type": "application/json",
                "key-puninar": keyPunHex,
                timestamp: timestamp,
              },
            }
          );

          if (!responseSession.data.success) {
            Swal.fire({
              title: "Session anda tidak aktif",
              icon: "warning",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => {
                  window.location.href = urlLobby;
                }, 1000);
              }
            });

            setIsSessionValid(false);
            return;
          }

          const responseModule: AxiosResponse<any> = await axios.post(
            import.meta.env.VITE_URL_SSO_MODULE_USER as string,
            {
              module: decodedModule.module,
              username: decodedUser.username,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "key-puninar": keyPunHex,
                timestamp: timestamp,
              },
            }
          );

          if (!responseModule.data.success) {
            Swal.fire({
              title: "Anda tidak memiliki akses module",
              icon: "warning",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                setTimeout(() => {
                  window.location.href = urlLobby;
                }, 1000);
              }
            });

            setIsSessionValid(false);
            return;
          }

          sessionStorage.setItem("user_module", JSON.stringify(decodedUser));
          sessionStorage.setItem("modules", JSON.stringify(decodedModule));
          setIsSessionValid(true);
        } catch (error) {
          log.error("SSO module user error:", error);
          setIsSessionValid(false);
        }
      }
    };

    checkSession();
  }, [navigate]);

  return isSessionValid;
};

function formatTimestamp(date: Date): string {
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
}

export default useSessionCheck;