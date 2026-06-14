"use client";
import { memo, useEffect, useState } from "react";
import * as classService from "../../../services/classService";
import * as mailConfigService from "../../../services/mailConfigService";
import {
  useQuery,
  useQueryClient,
} from "node_modules/@tanstack/react-query/build/modern";
import { useMutationHooks } from "src/hooks/useMutationHooks";
import { toast } from "react-toastify";

interface MailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit";
  initialData?: any;
}

const MailConfigModal = ({
  isOpen,
  onClose,
  type,
  initialData,
}: MailConfigModalProps) => {
  const queryClient = useQueryClient();

  // Unified Form State Object initialized from initialData (remounted when modal opens)
  const [formData, setFormData] = useState({
    loai_chu_ky: initialData?.loai_chu_ky || "weekly",
    gio_gui: initialData?.gio_gui || 20,
    diem_min:
      initialData?.diem_min !== undefined ? String(initialData.diem_min) : "",
    diem_max:
      initialData?.diem_max !== undefined ? String(initialData.diem_max) : "",
    email_nhan: initialData?.email_nhan || "",
    kich_hoat: initialData?.kich_hoat ?? 1,
  });

  // Single Change Handler
  const handleOnChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAllThuky = async () => {
    const res = await classService.getAllThuky();
    return res;
  };

  const { data: allThuky } = useQuery({
    queryKey: ["all-thuky"],
    queryFn: () => getAllThuky(),
    enabled: isOpen,
  });

  // Set default email selection once data is loaded
  useEffect(() => {
    if (allThuky?.data && allThuky.data.length > 0 && !formData.email_nhan) {
      const firstEmail = allThuky.data[0].email1 || allThuky.data[0].email2;
      if (firstEmail) {
        handleOnChange("email_nhan", firstEmail);
      }
    }
  }, [allThuky, formData.email_nhan]);

  const createMutation = useMutationHooks((data: any) =>
    mailConfigService.createMailConfig(data),
  );

  const updateMutation = useMutationHooks(
    (data: { id: string; payload: any }) =>
      mailConfigService.updateMailConfig(data.id, data.payload),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedMin = parseFloat(formData.diem_min);
    const parsedMax = parseFloat(formData.diem_max);

    if (isNaN(parsedMin) || parsedMin < 0 || parsedMin > 10) {
      toast.error("Điểm tối thiểu phải từ 0 đến 10");
      return;
    }

    if (isNaN(parsedMax) || parsedMax < 0 || parsedMax > 10) {
      toast.error("Điểm tối đa phải từ 0 đến 10");
      return;
    }

    const minDecimalPlaces = formData.diem_min.includes(".")
      ? formData.diem_min.split(".")[1].length
      : 0;
    const maxDecimalPlaces = formData.diem_max.includes(".")
      ? formData.diem_max.split(".")[1].length
      : 0;

    if (minDecimalPlaces > 2) {
      toast.error("Điểm tối thiểu chỉ được phép tối đa 2 chữ số thập phân");
      return;
    }

    if (maxDecimalPlaces > 2) {
      toast.error("Điểm tối đa chỉ được phép tối đa 2 chữ số thập phân");
      return;
    }

    if (parsedMin > parsedMax) {
      toast.error("Điểm tối thiểu không được lớn hơn điểm tối đa");
      return;
    }

    const payload = {
      loai_chu_ky: formData.loai_chu_ky,
      gio_gui: Number(formData.gio_gui),
      diem_min: parsedMin,
      diem_max: parsedMax,
      email_nhan: formData.email_nhan || null,
      kich_hoat: formData.kich_hoat,
    };

    if (type === "edit" && initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        {
          onSuccess: (res: any) => {
            toast.success(res?.message || "Cập nhật cấu hình thành công");
            queryClient.invalidateQueries({ queryKey: ["mailConfigs"] });
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Tạo cấu hình thành công");
          queryClient.invalidateQueries({ queryKey: ["mailConfigs"] });
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800">
            {type === "edit"
              ? "Cập nhật cấu hình gửi mail"
              : "Thêm cấu hình gửi mail mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Chu kỳ */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Chu kỳ gửi báo cáo
              </label>
              <select
                value={formData.loai_chu_ky}
                onChange={(e) => handleOnChange("loai_chu_ky", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none   focus:border-[#8B0000] text-sm text-gray-700 transition-all"
              >
                <option value="daily">Hàng ngày (Daily)</option>
                <option value="weekly">Hàng tuần (Weekly)</option>
                <option value="monthly">Hàng tháng (Monthly)</option>
              </select>
            </div>

            {/* Giờ gửi */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Khung giờ gửi (chỉ từ 20h - 23h)
              </label>
              <select
                value={formData.gio_gui}
                onChange={(e) =>
                  handleOnChange("gio_gui", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none   focus:border-[#8B0000] text-sm text-gray-700 transition-all"
              >
                <option value={20}>20:00</option>
                <option value={21}>21:00</option>
                <option value={22}>22:00</option>
                <option value={23}>23:00</option>
              </select>
            </div>

            {/* Khoảng điểm TB */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Điểm tối thiểu
                </label>
                <input
                  type="text"
                  placeholder="-"
                  value={formData.diem_min}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) {
                      handleOnChange("diem_min", val);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none   focus:border-[#8B0000] text-sm text-gray-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Điểm tối đa
                </label>
                <input
                  type="text"
                  value={formData.diem_max}
                  placeholder="-"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d*$/.test(val)) {
                      handleOnChange("diem_max", val);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none   focus:border-[#8B0000] text-sm text-gray-700 transition-all"
                />
              </div>
            </div>

            {/* Email nhận */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email nhận báo cáo
              </label>
              <select
                value={formData.email_nhan}
                onChange={(e) => handleOnChange("email_nhan", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none   focus:border-[#8B0000] text-sm text-gray-700 transition-all"
              >
                {allThuky?.data?.map((tk: any) => {
                  const email = tk.email1 || tk.email2;
                  return (
                    <option key={tk.id} value={email}>
                      {tk.ten} ({email || "Chưa cấu hình email"})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Trạng thái hoạt động */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Kích hoạt ngay
              </span>
              <button
                type="button"
                onClick={() =>
                  handleOnChange("kich_hoat", formData.kich_hoat === 1 ? 0 : 1)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  formData.kich_hoat === 1 ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    formData.kich_hoat === 1 ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className={`px-4 py-2 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Đang xử lý..."
                : type === "edit"
                  ? "Cập nhật"
                  : "Lưu cấu hình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(MailConfigModal);
