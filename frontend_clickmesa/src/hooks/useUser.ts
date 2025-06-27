
"use client";

import { useEffect, useState } from "react";

interface UserData {
    id: number;
    username: string;
}

export default function useUser() {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        const username = localStorage.getItem("username");
        if (user_id && username) {
            setUser({
                id: parseInt(user_id),
                username
            });
        }
    }, []);

    return { user };
}