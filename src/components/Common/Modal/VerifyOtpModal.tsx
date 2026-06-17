import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import {
  verifyOtpService,
  getProfileService,
  logoutService,
} from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/store/useUserStore";
import { jwtDecode } from "jwt-decode";

const VerifyOtpModal = ({
  visible,
  onClose,
  userCode,
}: {
  visible: boolean;
  onClose: () => void;
  userCode: string;
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { setProfile, setRole } = useUserStore();

  useEffect(() => {
    if (!visible) {
      setOtp(Array(6).fill(""));
    }
  }, [visible]);

  const verifyMutation = useMutation({
    mutationFn: async (otpString: string) => {
      const res = await verifyOtpService(userCode, otpString);
      await AsyncStorage.setItem("accessToken", res.accessToken);
      if (res.refreshToken) {
        await AsyncStorage.setItem("refreshToken", res.refreshToken);
      }
      const profileData = await getProfileService();
      
      // Giải mã token để check quyền
      const decoded: any = jwtDecode(res.accessToken);
      return { profileData, decodedRole: decoded.role };
    },
    onSuccess: async (data) => {
      setProfile(data.profileData.data);
      setRole(data.decodedRole);
      
      if (data.decodedRole === "Sinh_vien") {
        onClose();
        router.replace("/(screens)/student");
      } else {
        Alert.alert("Lỗi", "Chỉ sinh viên mới được đăng nhập trên App!");
        await logoutService();
        onClose();
      }
    },
    onError: (error: any) => {
      console.log(error);
      Alert.alert("Lỗi", error.response?.data?.message || "Xác thực thất bại");
    },
  });

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số OTP");
      return;
    }
    verifyMutation.mutate(otpString);
  };

  const handleOtpChange = (text: string, index: number) => {
    // Xử lý Paste (dán chuỗi nhiều ký tự)
    if (text.length > 1) {
      const pastedData = text.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = pastedData[i];
        }
      }
      setOtp(newOtp);
      // Chuyển focus đến ô cuối cùng vừa điền
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
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
            onPress={handleVerify}
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-[17px] tracking-wide">
                Xác thực
              </Text>
            )}
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
