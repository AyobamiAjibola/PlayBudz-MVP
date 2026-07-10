import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
} from "react-native";
import * as Location from "expo-location";
import { Text } from "./ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import AppTextInput from "./AppTextInput";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";

export type SelectedLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

type LocationSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

type LocationSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSelectLocation: (location: SelectedLocation) => void;
  placeholder?: string;
};

export function LocationSearchInput({
  value,
  onChangeText,
  onSelectLocation,
  placeholder = "Search Location",
}: LocationSearchInputProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);

  const searchLocation = async (text: string) => {
    onChangeText(text);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text
        )}&format=json&addressdetails=1&limit=5`
      );

      const data: LocationSuggestion[] = await response.json();

      setSuggestions(data);
    } catch (error) {
      console.log("Location search error:", error);
    }
  };

  const handleSelectLocation = (item: LocationSuggestion) => {
    const selectedLocation = {
      name: item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
    };

    onChangeText(item.display_name);
    setSuggestions([]);
    onSelectLocation(selectedLocation);
  };

  const handleReset = () => {
    const selectedLocation = {};

    onChangeText("");
    setSuggestions([]);
    onSelectLocation;
  };

  const useCurrentLocation = async () => {
    try {
        setLoadingCurrentLocation(true);

        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
            alert("Location permission is required.");
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        if (!currentLocation) {
            alert("Unable to get your current location.");
            return;
        }

        const { latitude, longitude } = currentLocation.coords;

        const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        const address = reverseGeocode[0];

        const formattedLocation = [
            address.city,
            address.region,
            address.country,
        ]
            .filter(Boolean)
            .join(", ");

        const selectedLocation = {
            name: formattedLocation,
            latitude,
            longitude,
        };

        onChangeText(formattedLocation);
        setSuggestions([]);
        onSelectLocation(selectedLocation);
    } catch (error) {
        console.log("Current location error:", error);
    } finally {
        setLoadingCurrentLocation(false);
    }
  };

  return (
    <View className="w-full">
      <AppTextInput
        value={value}
        onChangeText={searchLocation}
        placeholder={placeholder}
        autoCapitalize="words"
        autoCorrect={false}
        style={{paddingLeft: 40}}
        rightIcon={
          <Pressable
              onPress={handleReset}
              style={{
                position: "absolute",
                right: 16,
                top: -2,
                height: 56,
                justifyContent: "center",
              }}
              hitSlop={10}
              >
              <Ionicons
                  name="close-circle"
                  size={22}
                  color="#6B7280"
              />
          </Pressable>
        }
        leftIcon={
          <Ionicons
            name="location-outline"
            size={22}
            color={Colors.borderColor}
            style={{
              position: "absolute",
              left: 12,
              top: 14,
              zIndex: 10
            }}
          />
        }
      />

      <Pressable
        onPress={useCurrentLocation}
        className="flex-row items-center gap-2"
        style={{justifyContent: "space-between", marginTop: 16}}
      >
        <View  
          style={{
            display: "flex", 
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 6
          }}
        >
          {loadingCurrentLocation ? (
            <ActivityIndicator size="small" />
          ) : (
            <FontAwesome name="map" size={20} color="black" />
          )}

          <Text 
            style={{
              fontSize: FontSize.default,
              fontFamily: Font.semiBold
            }}
          >
            Use Current Location
          </Text>
        </View>
      </Pressable>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => `${item.lat}-${item.lon}`}
          className="mt-3"
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectLocation(item)}
              className="py-3"
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: "row",
                  gap: 4
                }}
              >
                <Ionicons
                    name="location-outline"
                    size={22}
                  />
                <Text style={{color: Colors.textGrey, fontSize: FontSize.default}}>
                  {item.display_name}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}