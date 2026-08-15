import { ReactNode, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface SelectOption {
  label: string;
  value: string;
}

interface AppSelectProps {
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  icon?: ReactNode;
}

export default function AppSelect({
  value,
  options,
  placeholder = "Select an option",
  onChange,
  isLoading=false,
  icon,
}: AppSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          height: 54,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "white",
          paddingHorizontal: 16,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          gap: 8
        }}
      >
        <View
          style={{
            gap: 8,
            flexDirection: "row",
            alignItems: 'center'
          }}
        >
          { icon }
          <Text className={selectedOption ? "text-base text-black" : "text-base text-gray-400"}>
            {selectedOption?.label || placeholder}
          </Text>
        </View>

        {isLoading ? <ActivityIndicator/> : <Ionicons name="chevron-down" size={20} color="#9CA3AF" />}
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="absolute inset-0"
            onPress={() => setOpen(false)}
          />

          <View className="max-h-[60%] rounded-t-3xl bg-white p-4">
            <View className="mb-4 h-1 w-12 self-center rounded-full bg-gray-300" />

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b border-gray-100 py-4"
                >
                  <Text className="text-base text-black">{item.label}</Text>

                  {item.value === value && (
                    <Ionicons name="checkmark" size={22} color="#991B1B" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}