import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base64DecodeWithSecret } from "./base64DecodeWithSecret";
import axios from "axios";
import Swal from "sweetalert2";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";

const SessionHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true";
      const basePath = isReverseProxy ? "/26" : "";
      const params = new URLSearchParams(window.location.search);
      const secretKey = import.meta.env.VITE_KEY_STATIC;
      const userParam = params.get("user");
      const moduleParam = params.get("module");
      const keySsoPuninar = import.meta.env.VITE_KEY_SSO_PUNINAR;
      const urlLobby = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN;

      const storedUser = localStorage.getItem("user_module");
      const storedModules = localStorage.getItem("modules");

      if (storedUser && storedModules) {
        if (params.size === 0) {
          return;
        }
        const decodedUserData = base64DecodeWithSecret(userParam, secretKey);
        const decodedModuleData = base64DecodeWithSecret(moduleParam, secretKey);
        if (decodedUserData.username === JSON.parse(storedUser).username && decodedModuleData.module === JSON.parse(storedModules).module) {
          return;
        }
        localStorage.setItem("modules", JSON.stringify(decodedModuleData));
        localStorage.setItem("user_module", JSON.stringify(decodedUserData));
      }

      let decodedUser, decodedModule;
      try {
        decodedUser = base64DecodeWithSecret(userParam, secretKey);
        decodedModule = base64DecodeWithSecret(moduleParam, secretKey);
      } catch (error) {
        navigate(`${basePath}/lobby`);
        return;
      }

      const body = {
        username: decodedUser.username,
        session_token: decodedUser.session_token,
        param: {
          module: decodedModule.module,
          key_module: import.meta.env.VITE_KEY_MODULE,
          _from: 'checkSession'
        },
      };

      const timestamp = formatTimestamp(new Date());
      const encryptionKey = `${keySsoPuninar}${timestamp}`;
      const keyPun = SHA256(encryptionKey).toString(Hex);

      try {
        const response = await axios.post(import.meta.env.VITE_URL_SSO_CHECK_GENERAL_USER, body, {
          headers: {
            "Content-Type": "application/json",
            "key-puninar": keyPun,
            timestamp: timestamp,
          },
        });

        if (!response.data.success) {
          Swal.fire({
            title: "Akses anda tidak aktif",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = urlLobby;
            }
          });
        }

        const storeDataInSession = async () => {
          localStorage.setItem("user_module", JSON.stringify(decodedUser));
          localStorage.setItem("modules", JSON.stringify(decodedModule));
        };

        await storeDataInSession();
      } catch (error) {
        console.log("Error checking session:", error);
        Swal.fire({
          title: "Akses anda tidak aktif",
          icon: "warning",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = urlLobby;
          }
        });
      }
    };

    checkSession();
  }, [navigate]);

  return <>{children}</>;
};

function formatTimestamp(date) {
  const options = {
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

  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;
  const hour = parts.find((part) => part.type === "hour").value;
  const minute = parts.find((part) => part.type === "minute").value;
  const second = parts.find((part) => part.type === "second").value;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export default SessionHandler;
