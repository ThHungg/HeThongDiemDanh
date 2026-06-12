import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import VerifyOtpModal from "@/components/Common/Modal/VerifyOtpModal";

const LoginScreen = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  return (
    <>
      <View className="flex-1 justify-center items-center bg-slate-50 px-4">
        <View className="bg-white p-8 rounded-[24px] shadow-xl shadow-slate-200/60 w-full max-w-[400px]">
          <View className="flex items-center mb-6">
            <View className="bg-primary/10 p-4 rounded-full mb-4">
              <Ionicons name="school" size={44} color="#8D0000" />
            </View>
            <Text className="font-extrabold text-2xl text-slate-800 text-center tracking-tight">
              Hệ thống điểm danh
            </Text>
            <Text className="text-slate-500 text-sm mt-1 text-center">
              Hệ thống quản lý điểm danh thông minh
            </Text>
          </View>

          {/* Phần Nhập liệu */}
          <View className="w-full relative mt-2">
            <Text className="text-sm font-semibold text-slate-700 mb-2 ml-1">
              Mã sinh viên
            </Text>

            <View className="relative justify-center">
              <TextInput
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pl-12 text-base text-slate-800 focus:border-primary focus:bg-white"
                placeholder="Ví dụ: CT050212..."
                placeholderTextColor="#9ca3af"
                autoCapitalize="characters"
              />
              {/* Icon nhỏ nằm trong ô Input */}
              <View
                className="absolute left-5 top-0 bottom-0 justify-center"
                pointerEvents="none"
              >
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsOtpVisible(true)}
            className="w-full mt-8 bg-[#8D0000] p-4 rounded-2xl flex-row items-center justify-center shadow-sm"
          >
            <Text className="text-white font-bold text-lg tracking-wide">
              Gửi mã xác thực
            </Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <VerifyOtpModal
        visible={isOtpVisible}
        onClose={() => setIsOtpVisible(false)}
      />
    </>
  );
};

export default LoginScreen;
