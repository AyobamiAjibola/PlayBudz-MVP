import { Modal, View } from "react-native";
import { ReactNode } from "react";

interface SearchModalProps {
  visible: boolean;
  children: ReactNode;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppModal({visible, setVisible, children}: SearchModalProps) {
  return (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
    >
        <View
            style={{
                flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "#00000066"
            }}
        >
            {children}
        </View>
    </Modal>
  )
}
