import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors, Font, FontSize } from "@/constants/utils";
import { AppButton } from "./ui/button";

type mode = "date" | "time" | "datetime" | "countdown"

interface AppDatePickerProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: mode;
  leftIcon?: React.ReactNode;
}

const INITIAL_DATE = new Date(1995, 0, 1);

export default function AppDatePicker({
  value,
  onChangeText,
  placeholder = "Date of Birth",
  maximumDate = new Date(2005, 0, 1),
  minimumDate = new Date(1900, 0, 1),
  mode="date", leftIcon
}: AppDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(() => {
    if (value) {
      const parsed = new Date(value);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return INITIAL_DATE;
  });

  const toggleDatePicker = () => {
    Keyboard.dismiss()
    setShowPicker((prev) => !prev);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);

      if (Platform.OS === "android") {
        onChangeText(formatDate(selectedDate));
        setShowPicker(false);
      }
    }
  };

  const confirmIosDate = () => {
    if(mode === "time") {
      onChangeText(formatTime(date));
    } else {
      onChangeText(formatDate(date));
    }
    setShowPicker(false);
  };

  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      
      if (!Number.isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  }, [value]);

  return (
    <View>
      {showPicker && Platform.OS === "ios" && (
        <View className="rounded-xl bg-white p-3">
          <View
            style={{
              alignItems: "flex-end",
              paddingHorizontal: 4,
            }}
          >
            <AntDesign
              name="close"
              size={24}
              color="#939DB1"
              onPress={() => setShowPicker(false)}
            />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontFamily: Font.semiBold,
              textAlign: "center",
            }}
          >
            {placeholder}
          </Text>
          <DateTimePicker
            value={date}
            mode={mode}
            display="spinner"
            onValueChange={(_, selectedDate) => {
              if (!selectedDate) return;

              setDate(selectedDate);

              if (Platform.OS === "android") {
                if(mode === "time") {
                  onChangeText(formatTime(selectedDate));
                } else {
                  onChangeText(formatDate(selectedDate));
                }
                setShowPicker(false);
              }
            }}
            onDismiss={() => {
              setShowPicker(false);
            }}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />

          <AppButton
            title="Done"
            textStyle={{ color: Colors.primary }}
            buttonStyle={{
              backgroundColor: Colors.lightPrimary,
              width: "100%",
              marginBottom: 4,
            }}
            onPress={confirmIosDate}
          />
        </View>
      )}

      {showPicker && Platform.OS === "android" && (
        // <DateTimePicker
        //   value={date}
        //   mode="date"
        //   display="default"
        //   onChange={handleChange}
        //   maximumDate={maximumDate}
        //   minimumDate={minimumDate}
        // />
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          onValueChange={(_, selectedDate) => {
            if (!selectedDate) return;

            setDate(selectedDate);
            if(mode === "time") {
              onChangeText(formatTime(selectedDate));
            } else {
              onChangeText(formatDate(selectedDate));
            }
            
            setShowPicker(false);
          }}
          onDismiss={() => {
            setShowPicker(false);
          }}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}

      {!showPicker && (
        <Pressable onPress={toggleDatePicker}>
          <View
            style={{
              height: 54,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#d1d5db",
              backgroundColor: "white",
              paddingHorizontal: 16,
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              gap: 8
            }}
          >
            { leftIcon }
            <Text
              className={
                value
                  ? "text-base text-black"
                  : "text-base text-gray-400"
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