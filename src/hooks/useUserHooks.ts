import { useUserStore } from "@/store/useUserStore"

export const useUserHooks = () => {
    const profile = useUserStore((state) => state.profile);

    return { user: profile, isLoaded: true, role: profile?.role};
}
