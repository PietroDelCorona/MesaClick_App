"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUnauthorized(true);
      setIsChecking(false);

      // ⏳ Aguarda 3 segundos ANTES de redirecionar
      const timeout = setTimeout(() => {
        router.replace("/");
      }, 6000);

      return () => clearTimeout(timeout); // limpa o timeout se desmontar
    }

    setIsChecking(false);
  }, [router]);

  return { isChecking, unauthorized };
}
