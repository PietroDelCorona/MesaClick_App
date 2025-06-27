"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      const username = localStorage.getItem("username")

      console.log("Verificando autenticação:", { token, user_id, username });

      if (!token || !user_id || !username) {
        setUnauthorized(true);
        // Limpa os dados inválidos se existirem parcialmente
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username")
        return false;
      }
      return true;
    };

    const isValid = verifyAuth();
    setIsChecking(false);

    if (!isValid) {
      const timeout = setTimeout(() => {
        router.replace("/login");
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [router]);

  return { isChecking, unauthorized };
}