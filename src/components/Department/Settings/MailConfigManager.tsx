"use client";
import { memo, useState } from "react";
import MailConfigModal from "./MailConfigModal";
import * as mailConfigService from "../../../services/mailConfigService";
import {
  useQuery,
  useQueryClient,
} from "node_modules/@tanstack/react-query/build/modern";
import { useMutationHooks } from "src/hooks/useMutationHooks";
import { toast } from "react-toastify";

const MailConfigManager = () => {
  const queryClient = useQueryClient();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  const handleOpenAddModal = () => {
    setSelectedConfig(null);
    setModalType("add");
    setIsOpenModal(true);
  };

  const handleOpenEditModal = (config: any) => {
    setSelectedConfig(config);
    setModalType("edit");
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedConfig(null);
  };

  const getMailConfigs = async () => {
    const res = await mailConfigService.getMailConfigs();
    return res;
  };

  const { data: mailConfigs, isLoading } = useQuery({
    queryKey: ["mailConfigs"],
    queryFn: getMailConfigs,
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutationHooks(
    (data: { id: string; kich_hoat: number }) =>
      mailConfigService.updateMailConfig(data.id, {
        kich_hoat: data.kich_hoat,
      }),
  );

  const handleToggleActive = (id: string, currentStatus: number) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    toggleActiveMutation.mutate(
      { id, kich_hoat: nextStatus },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Cập nhật trạng thái thành công");
          queryClient.invalidateQueries({ queryKey: ["mailConfigs"] });
        },
      },
    );
  };

  // Delete configuration mutation
  const deleteMutation = useMutationHooks((id: string) =>
    mailConfigService.deleteMailConfig(id),
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Xóa cấu hình thành công");
        queryClient.invalidateQueries({ queryKey: ["mailConfigs"] });
      },
    });
  };

  // Send now mutation
  const sendNowMutation = useMutationHooks((id: string) =>
    mailConfigService.sendMailNow(id),
  );

  const handleSendNow = (id: string) => {
    sendNowMutation.mutate(id, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Gửi báo cáo email thành công!");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Gửi mail thất bại.");
      }
    });
  };

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 bg-slate-50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-full text-[#8B0000] flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-800">
              Cấu hình tự động gửi email cảnh báo
            </h3>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Hệ thống quét và tự động gửi danh sách sinh viên có điểm chuyên
              cần thấp trong khoảng điểm lọc.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[#8B0000] text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Thêm cấu hình
        </button>
      </div>

      {/* Table Content */}
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left text-[14px] text-gray-600">
            <thead className="bg-slate-50 text-[13px] text-gray-500 uppercase tracking-wider border-b border-gray-200 font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Chu kỳ gửi</th>
                <th className="px-6 py-4">Giờ gửi</th>
                <th className="px-6 py-4">Ngày gửi cụ thể</th>
                <th className="px-6 py-4 text-center">Khoảng điểm TB</th>
                <th className="px-6 py-4">Email nhận</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 font-semibold"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : !mailConfigs?.data || mailConfigs.data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">
                    Chưa có cấu hình gửi mail nào được tạo.
                  </td>
                </tr>
              ) : (
                mailConfigs.data.map((config: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          config.loai_chu_ky === "daily"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : config.loai_chu_ky === "weekly"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}
                      >
                        {config.loai_chu_ky === "daily"
                          ? "Hàng ngày"
                          : config.loai_chu_ky === "weekly"
                            ? "Hàng tuần"
                            : "Hàng tháng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {config.gio_gui}h:00
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {config.loai_chu_ky === "daily" && "Mỗi ngày"}
                      {config.loai_chu_ky === "weekly" && "Chủ nhật"}
                      {config.loai_chu_ky === "monthly" && "Ngày cuối tháng"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded text-xs">
                        {config.diem_min.toFixed(1)} -{" "}
                        {config.diem_max.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">
                      {config.email_nhan ? (
                        <span title={config.email_nhan}>
                          {config.email_nhan}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          Mặc định (Tất cả thư ký)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <button
                          disabled={
                            toggleActiveMutation.isPending &&
                            toggleActiveMutation.variables?.id === config.id
                          }
                          onClick={() =>
                            handleToggleActive(config.id, config.kich_hoat)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                            config.kich_hoat === 1
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          } ${
                            toggleActiveMutation.isPending &&
                            toggleActiveMutation.variables?.id === config.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                              config.kich_hoat === 1
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          disabled={
                            sendNowMutation.isPending &&
                            sendNowMutation.variables === config.id
                          }
                          onClick={() => handleSendNow(config.id)}
                          className={`text-emerald-600 hover:text-emerald-800 text-xs font-bold transition-colors ${
                            sendNowMutation.isPending &&
                            sendNowMutation.variables === config.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {sendNowMutation.isPending &&
                          sendNowMutation.variables === config.id
                            ? "Đang gửi..."
                            : "Gửi ngay"}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleOpenEditModal(config)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors"
                        >
                          Sửa
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          disabled={
                            deleteMutation.isPending &&
                            deleteMutation.variables === config.id
                          }
                          onClick={() => handleDelete(config.id)}
                          className={`text-red-600 hover:text-red-800 text-xs font-bold transition-colors ${
                            deleteMutation.isPending &&
                            deleteMutation.variables === config.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form component */}
      {isOpenModal && (
        <MailConfigModal
          isOpen={isOpenModal}
          onClose={handleCloseModal}
          type={modalType}
          initialData={selectedConfig}
        />
      )}
    </div>
  );
};

export default memo(MailConfigManager);
