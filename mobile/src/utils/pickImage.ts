import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";

export async function pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
        alert("Permission to access photos is required.");
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    const asset = result.assets[0];

    return asset

    // const source = new File(asset.uri);
    // const destination = new File(
    //     Paths.document,
    //     asset.fileName ?? `image-${Date.now()}.jpg`
    // );

    // source.copy(destination);

    // return destination.uri;

  } catch (error) {
    console.log("Image picker error:", error);
    return null;
  }
}