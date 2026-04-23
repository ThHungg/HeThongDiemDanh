import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SemesterState {
    selectedSemester: string | null; // Tên biến nên đồng nhất
    setSelectedSemester: (semester: string) => void;
    clearSemester: () => void;
}

export const useSemesterStore = create<SemesterState>()(
    persist(
        (set) => ({
            selectedSemester: null, 
            setSelectedSemester: (semester) => set({ selectedSemester: semester }),
            clearSemester: () => set({ selectedSemester: null }),
        }),
        {
            name: "semester-data", 
            storage: createJSONStorage(() => localStorage),
        }
    )
);