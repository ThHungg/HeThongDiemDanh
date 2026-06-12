import React from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const VerifyOtpModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  
  // Tạo mảng 6 phần tử để map ra 6 ô nhập tĩnh
  const otpBoxes = new Array(6).fill("");

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View
        className="flex-1 justify-center items-center px-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="bg-white rounded-[24px] p-6 w-full max-w-sm relative items-center shadow-lg">
          <TouchableOpacity
            className="absolute top-4 right-4 z-10 p-2"
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-[24px] font-bold text-[#8D0000] text-center mb-3">
            Xác thực OTP
          </Text>

          <Text className="text-gray-700 text-center text-sm mb-6 leading-5">
            Mã xác thực đã được gửi đến email của bạn.{"\n"}
            Vui lòng nhập để tiếp tục.
          </Text>

          <View className="flex-row items-center justify-between w-full mb-8">
            {otpBoxes.map((_, index) => (
              <TextInput
                key={index}
                style={{
                  backgroundColor: "#F6ECEC",
                  width: 44,
                  height: 48,
                  borderRadius: 12,
                  color: "#8D0000",
                  fontSize: 22,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                maxLength={1}
                keyboardType="number-pad"
              />
            ))}
          </View>

          {/* Nút bấm Xác thực */}
          <TouchableOpacity
            style={{ backgroundColor: "#8D0000" }}
            className="rounded-xl w-full h-[52px] flex justify-center items-center mb-5 shadow-sm"
            activeOpacity={0.8}
            onPress={() => {
              onClose(); // Đóng modal trước
              router.replace("/(screens)/detailClassScreen"); // Chuyển hướng sang màn detail
            }}
          >
            <Text className="text-white font-bold text-[17px] tracking-wide">
              Xác thực
            </Text>
          </TouchableOpacity>

          {/* Thời gian gửi lại mã */}
          <View className="flex-row items-center justify-center mb-2">
            <Ionicons
              name="time-outline"
              size={18}
              color="#4B5563"
              style={{ marginRight: 6 }}
            />
            <Text className="text-gray-700 font-medium text-[15px]">
              Gửi lại mã sau{" "}
              <Text className="text-[#8D0000] font-bold">00:04</Text>
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyOtpModal;
