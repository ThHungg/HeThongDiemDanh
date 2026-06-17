import { create } from "zustand";

interface UserProfile {
  ma_sinh_vien: string;
  ten: string;
  email1: string;
  email2?: string;
  dien_thoai1: string;
  lop_chuyen_nganh: string;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  role: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setRole: (role: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  role: null,
  setProfile: (profile) => set({ profile }),
  setRole: (role) => set({ role }),
  clearUser: () => set({ profile: null, role: null }),
}));
