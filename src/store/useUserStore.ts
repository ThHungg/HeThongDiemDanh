// interface GiangVien {
//   ten: string;
//   ma_giang_vien: string;
//   dien_thoai: string;
//   email1: string;
//   email2: string;
//   don_vi: string;
//   hoc_vi: string;
// }

// interface SinhVien {
//   ten: string;
//   ma_sinh_vien: string;
//   dien_thoai1: string;
//   dien_thoai2: string;
//   email1: string;
//   email2: string;
//   khoa: string;
//   khoa_nhap_hoc: string;
//   lop_chuyen_nganh: string;
// }
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserProfile {
  ten: string;
  email1: string;
  email2: string;
  role: string;
  // Các trường của Giảng viên
  ma_giang_vien?: string;
  dien_thoai?: string;
  don_vi?: string;
  hoc_vi?: string;
  // Các trường của Sinh viên
  ma_sinh_vien?: string;
  dien_thoai1?: string;
  dien_thoai2?: string;
  khoa?: string;
  khoa_nhap_hoc?: string;
  lop_chuyen_nganh?: string;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null, 
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "user-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);