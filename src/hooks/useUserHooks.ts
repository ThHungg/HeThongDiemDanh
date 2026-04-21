import { useUserStore } from "@/store/useUserStore"
import { useEffect, useState } from "react";

export const useUserHooks = () => {
    const profile = useUserStore((state) => state.profile);
    const [user, setUser] = useState<typeof profile>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setUser(profile);
        setIsLoaded(true);
    }, [profile]);

    return { user, isLoaded , role: user?.role};
}