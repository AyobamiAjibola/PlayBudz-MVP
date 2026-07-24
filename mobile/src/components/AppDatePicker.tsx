import { useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors, Font } from "@/constants/utils";
import { AppButton } from "./ui/button";

interface AppDatePickerProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function AppDatePicker({
  value,
  onChangeText,
  placeholder = "Date of Birth",
  maximumDate = new Date(2005, 0, 1),
  minimumDate = new Date(1900, 0, 1),
}: AppDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleDatePicker = () => {
    setShowPicker((prev) => !prev);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);

      if (Platform.OS === "android") {
        setShowPicker(false);
        onChangeText(formatDate(selectedDate));
      }
    }

    if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const confirmIosDate = () => {
    onChangeText(formatDate(date));
    setShowPicker(false);
  };

  return (
    <View>
      {showPicker && Platform.OS === "ios" && (
        <View className="rounded-xl bg-white p-3">
          <View style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end", paddingHorizontal: 4}}>
            <AntDesign name="close" size={24} color={"#939DB1"} onPress={() => setShowPicker(false)} />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: Font.semiBold,
              textAlign: "center"
            }}
          >{placeholder}</Text>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            style={{ height: 120 }}
            textColor="black"
          />

          <AppButton
            title="Done"
            textStyle={{color: Colors.primary}}
            buttonStyle={{backgroundColor: Colors.lightPrimary, width: '100%', marginBottom: 4}}
            onPress={confirmIosDate}
          />
        </View>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          textColor="black"
        />
      )}

      {!showPicker && (
        <Pressable onPress={toggleDatePicker}>
          <View className="h-14 justify-center rounded-xl border border-gray-300 bg-white px-4">
            <Text
              className={
                value ? "text-base text-black" : "text-base text-gray-400"
              }
            >
              {value || placeholder}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}