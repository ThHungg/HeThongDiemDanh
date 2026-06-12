import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const DetailClassScreen = () => {
  return (
    <SafeAreaView className="bg-slate-50" style={{ flex: 1 }}>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="w-10 h-10 items-center justify-center mr-2">
            <Text className="text-blue-900 font-bold text-xl italic">
              T<Text className="text-red-600">L</Text>
            </Text>
          </View>
          <View>
            <Text className="text-base font-bold text-gray-900">
              Trường Đại học Thăng Long
            </Text>
            <Text className="text-xs text-gray-500">Hệ thống quản lý</Text>
          </View>
        </View>
        <TouchableOpacity className="p-2">
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
                ĐẶNG THÀNH
              </Text>
              <Text className="text-sm font-bold text-gray-900 mt-1">
                *****
              </Text>
              <Text className="text-sm font-medium text-gray-900 mb-1">
                A46588
              </Text>
              <View className="bg-primary/10 self-start px-2 py-0.5 rounded-md">
                <Text className="text-primary font-bold text-xs">TT35CL07</Text>
              </View>
            </View>
          </View>

          {/* Right Box: Total Classes */}
          <View className="bg-red-50 w-20 py-3 rounded-2xl items-center justify-center">
            <Text className="text-gray-800 text-xs text-center font-medium">
              Tổng{"\n"}số lớp
            </Text>
            <Text className="text-primary font-bold text-xl mt-1">6</Text>
          </View>
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-4">
          <Ionicons name="list-outline" size={20} color="#8D0000" />
          <Text className="text-lg font-bold text-gray-900 ml-2">
            Lớp học của tôi
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="bg-primary self-start px-3 py-1.5 rounded-lg mb-3">
            <Text className="text-white font-bold text-xs">IT380</Text>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-2">
            Dự án Công nghệ thông tin
          </Text>

          <Text className="text-indigo-400 text-sm font-semibold mb-1">
            Thứ 4: Tiết 4-9 (A701)
          </Text>
          <Text className="text-indigo-400 text-sm font-semibold mb-1">
            Thứ 8: Tiết 3-5 (B710)
          </Text>

          <View className="h-px bg-white w-full my-4" />

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-500 font-medium text-sm">Mã lớp:</Text>
            <Text className="text-gray-900 font-bold text-sm">242IT380.02</Text>
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-gray-500 font-medium text-sm">
              Giảng viên:
            </Text>
            <Text className="text-gray-900 font-bold text-sm">
              Nguyễn Xuân Thanh
            </Text>
          </View>

          <TouchableOpacity className="bg-gray-900 rounded-xl w-full py-3.5 flex-row justify-center items-center">
            <Text className="text-white font-bold text-base mr-2">
              Xem chi tiết
            </Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailClassScreen;
