import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getClassesByStudentService } from "@/services/studentService";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import { logoutService } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentDashboard = () => {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const clearUser = useUserStore((state) => state.clearUser);

  const { data: classesData, isLoading } = useQuery({
    queryKey: ["student-classes"],
    queryFn: getClassesByStudentService,
  });

  const classesList = classesData?.data?.dangKy || [];

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      console.log(
        "🚀 Kiểm tra Token trong Storage:",
        token
          ? "ĐÃ LƯU: " + token.substring(0, 20) + "..."
          : "CHƯA LƯU HOẶC BỊ TRỐNG",
      );
    };
    checkToken();
    console.log(
      "📊 Số lượng lớp học nhận được trong classesList:",
      classesList.length,
    );
  }, [classesList]);

  const handleLogout = async () => {
    try {
      await logoutService();
      clearUser();
      router.replace("/(auth)/loginScreen");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="mr-3">
            <Image
              source={{
                uri: "https://thanglong.edu.vn/themes/md_tlu/img/logo.svg",
              }}
              style={{ width: 100, height: 40 }}
              contentFit="contain"
            />
          </View>
        </View>
        <TouchableOpacity className="p-2" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="px-4 pt-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-2xl p-5 mb-6 flex-row items-center justify-between shadow-sm border border-gray-100">
          <View className="flex-row items-center flex-1">
            <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center overflow-hidden border-2 border-gray-100 mr-4">
              <Ionicons
                name="person"
                size={40}
                color="#9CA3AF"
                style={{ marginTop: 10 }}
              />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900 uppercase">
                {profile?.ten || "Sinh viên"}
              </Text>
              <Text className="text-sm font-bold text-gray-900 mt-1">
                *****
              </Text>
              <Text className="text-sm font-medium text-gray-900 mb-1">
                {profile?.ma_sinh_vien || "Không xác định"}
              </Text>
              {profile?.lop_chuyen_nganh && (
                <View className="bg-primary/10 self-start px-2 py-0.5 rounded-md">
                  <Text className="text-primary font-bold text-xs">
                    {profile.lop_chuyen_nganh}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="bg-red-50 w-20 py-3 rounded-2xl items-center justify-center">
            <Text className="text-gray-800 text-xs text-center font-medium">
              Tổng{"\n"}số lớp
            </Text>
            <Text className="text-primary font-bold text-xl mt-1">
              {classesList.length}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-4">
          <Ionicons name="list-outline" size={20} color="#8D0000" />
          <Text className="text-lg font-bold text-gray-900 ml-2">
            Lớp học của tôi
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#8D0000" />
        ) : classesList.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            Bạn chưa đăng ký lớp học nào trong học kỳ này.
          </Text>
        ) : (
          classesList.map((item: any, index: number) => {
            const classInfo = item.hocPhan;
            const lecturer = item.giangVien?.ten || "Chưa xác định";
            const schedules = item.thoiKhoaBieuChiTiet || [];

            return (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                <View className="bg-primary self-start px-3 py-1.5 rounded-lg mb-3">
                  <Text className="text-white font-bold text-xs">
                    {classInfo?.maHocPhan}
                  </Text>
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {classInfo?.tenHocPhan}
                </Text>

                {schedules.map((schedule: any, sIdx: number) => (
                  <Text
                    key={sIdx}
                    className="text-indigo-400 text-sm font-semibold mb-1"
                  >
                    Thứ {schedule.thu}: Tiết {schedule.tiet} ({schedule.phong})
                  </Text>
                ))}

                <View className="h-px bg-gray-100 w-full my-4" />

                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-500 font-medium text-sm">
                    Mã lớp:
                  </Text>
                  <Text className="text-gray-900 font-bold text-sm">
                    {item.maLopHocPhan}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-5">
                  <Text className="text-gray-500 font-medium text-sm">
                    Giảng viên:
                  </Text>
                  <Text className="text-gray-900 font-bold text-sm">
                    {lecturer}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/(screens)/student/attendance/${item.maLopHocPhan}`,
                    )
                  }
                  className="bg-gray-900 rounded-xl w-full py-3.5 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-base mr-2">
                    Xem chi tiết
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;
