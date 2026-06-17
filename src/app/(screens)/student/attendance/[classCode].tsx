import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSpecificStudentAttendance } from "@/services/studentService";
import { useUserStore } from "@/store/useUserStore";
import { useLocalSearchParams, useRouter } from "expo-router";

const AttendanceDetailScreen = () => {
  const router = useRouter();
  const { classCode } = useLocalSearchParams();
  const profile = useUserStore((state) => state.profile);
  const queryClient = useQueryClient();
  
  const classesData: any = queryClient.getQueryData(["student-classes"]);
  const detailClass = classesData?.data?.dangKy?.find((c: any) => c.maLopHocPhan === classCode);

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["student-attendance", classCode, profile?.ma_sinh_vien],
    queryFn: () => getSpecificStudentAttendance(classCode as string, profile?.ma_sinh_vien as string),
    enabled: !!classCode && !!profile?.ma_sinh_vien,
  });

  const attendanceObject = attendanceData?.data;
  let studentAttendance: any[] = [];
  
  if (attendanceObject && !Array.isArray(attendanceObject) && attendanceObject.buoiHoc) {
    studentAttendance = attendanceObject.buoiHoc;
  } else if (Array.isArray(attendanceObject) && attendanceObject.length > 0 && attendanceObject[0].buoiHoc) {
    studentAttendance = attendanceObject[0].buoiHoc;
  }

  return (
    <SafeAreaView className="bg-slate-50 flex-1">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#111827" />
          <Text className="text-lg font-bold text-gray-900 ml-2">Chi tiết điểm danh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-4 pt-5 pb-10">
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
          <Text className="text-xl font-bold text-gray-900 mb-2">Lớp: {classCode}</Text>
          <Text className="text-sm font-medium text-gray-500 mb-4">Sinh viên: {profile?.ten} - {profile?.ma_sinh_vien}</Text>

          {detailClass && (
            <View className="mb-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-3 pr-2">
                  <Text className="text-[11px] text-gray-500 font-bold uppercase mb-1">MÔN HỌC</Text>
                  <Text className="text-[13px] font-bold text-[#8B0000]">{detailClass.hocPhan?.tenHocPhan}</Text>
                </View>
                <View className="w-1/2 mb-3 pl-2">
                  <Text className="text-[11px] text-gray-500 font-bold uppercase mb-1">GIẢNG VIÊN</Text>
                  <Text className="text-[13px] font-bold text-gray-900">{detailClass.giangVien?.ten}</Text>
                </View>
                <View className="w-1/2 pr-2">
                  <Text className="text-[11px] text-gray-500 font-bold uppercase mb-1">LỊCH HỌC</Text>
                  <Text className="text-[12px] font-semibold text-gray-400">
                    {detailClass.thoiKhoaBieuChiTiet?.map((s: any) => `T${s.thu} ${s.tiet} (${s.phong})`).join(" / ")}
                  </Text>
                </View>
                <View className="w-1/2 pl-2">
                  <Text className="text-[11px] text-gray-500 font-bold uppercase mb-1">SỨC CHỨA</Text>
                  <Text className="text-[13px] font-bold text-gray-900">
                    {detailClass.hocPhan?.soLuongDangKy} / {detailClass.hocPhan?.sucChua}
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          <View className="flex-row justify-between border-b border-gray-100 pb-2 mb-4">
            <Text className="text-gray-900 font-bold">Ngày học</Text>
            <Text className="text-gray-900 font-bold">Trạng thái</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#8D0000" />
          ) : studentAttendance.length === 0 ? (
            <Text className="text-center text-gray-500">Chưa có dữ liệu điểm danh.</Text>
          ) : (
            studentAttendance.map((record: any, index: number) => {
              const isPresent = record.diemSo !== null;
              return (
                <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-50">
                  <Text className="text-gray-700 font-medium">
                    {record.ngayHoc ? new Date(record.ngayHoc).toLocaleDateString("vi-VN") : "Chưa có ngày"}
                  </Text>
                  <View className={`px-3 py-1 rounded-full ${isPresent ? "bg-green-100" : "bg-red-100"}`}>
                    <Text className={`font-bold text-xs ${isPresent ? "text-green-700" : "text-red-700"}`}>
                      {isPresent ? "Có mặt" : "Vắng mặt"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendanceDetailScreen;
