import { LocationSearchInput, SelectedLocation } from '@/components/LocationSearchInput';
import { Text } from '@/components/ui/text'
import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from "expo-image-picker";
import { api } from '@/api/axios';
import Toast from 'react-native-toast-message'
import { Colors, Font, FontSize } from '@/constants/utils';
import { pickImage } from '@/utils/pickImage';
import CameraIcon from '@/assets/icons/camera.svg';
import { Image } from 'expo-image';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AppTextInput from '@/components/AppTextInput';
import AppDatePicker from '@/components/AppDatePicker';
import Calendar from "@/assets/icons/calendar.svg";
import ClockIcon from "@/assets/icons/clock_.svg";
import AppSelect from '@/components/AppSelect';
import { router } from 'expo-router';
import SportIcon from "@/assets/icons/game.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import SkillIcon from '@/assets/icons/ranking.svg';
import BottomSection from '@/features/auth/components/BottomSection';
import MapView, { Marker } from "react-native-maps";
import { AppButton } from '@/components/ui/button';
import { useFetchSports } from '../hooks/useFetchSports';
import MapMarkerIcon from "@/assets/icons/map-marker.svg"

const fallbackImage = (require("@/assets/events/3.jpg"))

export interface EventType {
  image: ImagePicker.ImagePickerAsset | null;
  eventName: string;
  eventDate: string;
  eventTime: string;
  sportType: string;
  players: string;
  skill_level: string[];
  description?: string;
  eventType: string;
}

type IProps = {
  eventId?: string;
}

type SportType = {
  label: string;
  value: string;
}

const SKILL_LEVEL = [
  {label: "Beginner", value: "beginner"},
  {label: "Intermediate", value: "intermediate"},
  {label: "Advanced", value: "advanced"}
]

const combineDateAndTime = (date: string, time: string) => {
  // Parse "Sep 01, 2026"
  const [monthText, dayText, yearText] = date
    .replace(",", "")
    .split(/\s+/);

  const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = months[monthText];
  const day = Number(dayText);
  const year = Number(yearText);

  // Normalize "12:00 AM" -> "12:00 AM"
  const normalizedTime = time.replace(/\s+/g, " ").trim();

  const [timePart, period] = normalizedTime.split(" ");
  const [hourString, minuteString] = timePart.split(":");

  let hours = Number(hourString);
  const minutes = Number(minuteString);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(
    year,
    month,
    day,
    hours,
    minutes,
    0,
    0
  );
};

const openGoogleMaps = (
    latitude: number,
    longitude: number,
) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  Linking.openURL(url);
};

export const splitDateAndTime = (dateTime: string) => {
  const date = new Date(dateTime);

  const eventDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const eventTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    eventDate,
    eventTime,
  };
};

const getUploadPath = (url: string) => {
  const index = url.indexOf("/uploads");

  return index !== -1 ? url.substring(index) : url;
};

export default function Event({ eventId }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventType>({
    image: null,
    eventName: "",
    eventDate: "",
    eventTime: "",
    sportType: "",
    players: "",
    skill_level: [],
    description: "",
    eventType: ""
  });
  const [location, setLocation] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [loadEvent, setLoadEvent] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const {
    sportOptions: sports,
    isLoading: loadSports
  } = useFetchSports();

const requiredFieldsMissing =
  !eventData.eventName ||
  !eventData.eventDate ||
  !eventData.eventTime ||
  !selectedLocation ||
  !eventData.sportType ||
  !eventData.players ||
  !eventData.skill_level ||
  !eventData.eventType;

const isDisabled =
  requiredFieldsMissing ||
  (!eventId && !eventData.image);

  const handleSubmit = async () => {
    setIsLoading(true)

    try {

      const location = {
        name: selectedLocation?.name,
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude
      }

      const gameDateTime = combineDateAndTime(eventData.eventDate, eventData.eventTime)
      
      const formData = new FormData();
      formData.append("image", {
          uri: eventData.image!.uri,
          name: eventData.image!.fileName ?? `event-${Date.now()}.jpg`,
          type: eventData.image!.mimeType ?? "image/jpeg"
      } as any);
      formData.append("gameType", eventData.eventType ?? "");
      formData.append("title", eventData.eventName ?? "");
      formData.append("description", eventData.description ?? "");
      formData.append("sport", eventData.sportType ?? "");
      formData.append("location", JSON.stringify(location));
      formData.append("gameDateTime", gameDateTime.toISOString());
      formData.append("players", eventData.players ?? "");
      formData.append("skill_level", JSON.stringify(eventData.skill_level) ?? "");

      const response = await api.post("/games/create-game", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(response.data.success) {
        setEventData({
          image: null,
          eventName: "",
          eventDate: "",
          eventTime: "",
          sportType: "",
          players: "",
          skill_level: [],
          description: "",
          eventType: ""
        })
        setSelectedLocation(null)
        
        setOpen(true)
      }

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message,
      });
    } finally {
      setIsLoading(false)
    }
  };

  const handleUpdateSubmit = async () => {
    setIsLoading(true)

    try {

      const location = {
        name: selectedLocation?.name,
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude
      }

      const gameDateTime = combineDateAndTime(eventData.eventDate, eventData.eventTime)

      const formData = new FormData();

      if(eventData.image?.uri) {
        formData.append("image", {
            uri: eventData.image!.uri,
            name: eventData.image!.fileName ?? `event-${Date.now()}.jpg`,
            type: eventData.image!.mimeType ?? "image/jpeg"
        } as any);
      } else if (imageUri) {
        formData.append(
          "imageUri",
          getUploadPath(imageUri),
        );
      }

      formData.append("title", eventData.eventName ?? "");
      formData.append("gameType", eventData.eventType ?? "");
      formData.append("description", eventData.description ?? "");
      formData.append("sport", eventData.sportType ?? "");
      formData.append("location", JSON.stringify(location));
      formData.append("gameDateTime", gameDateTime.toISOString());
      formData.append("players", eventData.players ?? "");
      formData.append("skill_level", JSON.stringify(eventData.skill_level) ?? "");

      const response = await api.patch(`/games/update-game?gameId=${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(response.data.success) {
        setEventData({
          image: null,
          eventName: "",
          eventDate: "",
          eventTime: "",
          sportType: "",
          players: "",
          skill_level: [],
          description: "",
          eventType: ""
        })
        setSelectedLocation(null)
        
        router.push(`/event/${[eventId]}`)
      }

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message
      });
    } finally {
      setIsLoading(false)
    }
  };

  const findEvent = async () => {
    setLoadEvent(true)
    try {
      const response = await api.get(`/games/game?eventId=${eventId}`)
      const event = response.data.data;

      const { eventDate, eventTime } = splitDateAndTime(event.gameDateTime)

      setEventData({
        image: null,
        eventName: event.title ?? "",
        eventDate: eventDate ?? "",
        eventTime: eventTime ?? "",
        sportType: event.sport ?? "",
        players: event.players ?? "",
        skill_level: JSON.parse(event.skill_level) ?? [],
        description: event.description ?? "",
        eventType: event.eventType ?? ""
      })
      const eventImg = `${process.env.EXPO_PUBLIC_SERVER}${event?.image}`;
      setImageUri(eventImg)
      setSelectedLocation(event.location ?? null)
      setLocation(event.location.name)

    } catch (error) {
      Toast.show({
        type: "error",
        text1: (error as Error).message,
        text1Style:{fontFamily: Font.regular, fontSize: FontSize.sm}
      });
    } finally {
      setLoadEvent(false)
    }
  }

  const handleUploadImage = async () => {
    const asset = await pickImage();

    if (asset) {
      setEventData({...eventData, image: asset})
    }
  };

  const handleSkillLevel = (value: string) => {
    const level = eventData.skill_level
    if(level.includes(value)) return;

    level.push(value)

    setEventData((prev) => ({
      ...prev,
      skill_level: level
    }))
  }

  const handleRemoveLevel = (value: string) => {
    const level = eventData.skill_level;
    const updatedLevels = level.filter((v) => v !== value);

    setEventData((prev) => ({
      ...prev,
      skill_level: updatedLevels
    }))
  }

  const closeModal = () => {
    router.replace('/home')
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if(eventId) {
      findEvent()
    }
  },[eventId]);

  if(loadEvent) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 8, flex: 1
        }}
      >
        <ActivityIndicator size={60}/>
        <Text
          style={{
            fontSize: FontSize.lg,
            fontFamily: Font.medium
          }}
        >Event Loading. Please wait...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={[{ 
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: keyboardVisible ? 180 : 60,
            gap: 20,
            marginTop: 20
          }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 20
            }}
          >
            {(!eventData.image && !imageUri) && (
              <View style={styles.image}>
                <TouchableOpacity style={[styles.cameraIcon, {paddingHorizontal: 24}]}
                  onPress={handleUploadImage}
                >
                  <CameraIcon/>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: Font.semiBold,
                      fontSize: FontSize.sm
                    }}
                  >
                    Upload image
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {(eventData.image || imageUri) && 
              <View style={{ width: 231, height: 186 }}>
                <Image
                  source={
                    eventData.image?.uri
                      ? { uri: eventData.image.uri }
                      : imageUri
                        ? imageUri
                        : fallbackImage
                  }
                  style={{ width: "100%", height: "100%", borderRadius: 16 }}
                  contentFit="cover"
                />
                <TouchableOpacity 
                  style={[{
                    position: "absolute",
                    top: 146, left: 110,
                    paddingHorizontal: 10,
                  }, styles.cameraIcon]}
                  onPress={handleUploadImage}
                >
                  <AntDesign name='edit' color="white" size={18}/>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: Font.semiBold,
                      fontSize: FontSize.sm
                    }}
                  >
                    Edit image
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>

          <AppTextInput
            value={eventData.eventName}
            onChangeText={(value)=>
              setEventData((prev) => ({
                ...prev, 
                eventName: value
              }))
            }
            placeholder="Event Name"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <AppSelect
            value={eventData.eventType}
            onChange={(value) => 
              setEventData((prev) => ({
                ...prev,
                eventType: value
              }))
            }
            placeholder="Indoor or Outdoor"
            options={[
              {value: "indoor", label: "Indoor"},
              {value: "outdoor", label: "Outdoor"}
            ] as SportType[]}
            // icon={<SportIcon/>}
          />
          <AppDatePicker
            value={eventData.eventDate}
            onChangeText={(value) =>
              setEventData((prev) => ({
                ...prev,
                eventDate: value,
              }))
            }
            placeholder="Date"
            mode="date"
            maximumDate={new Date(2070, 0, 1)}
            minimumDate={new Date(2026, 0, 1)}
            leftIcon={<Calendar />}
          />
          <AppDatePicker
            value={eventData.eventTime}
            onChangeText={(value) =>
              setEventData((prev) => ({
                ...prev,
                eventTime: value,
              }))
            }
            placeholder="Time"
            mode="time"
            leftIcon={<ClockIcon />}
          />

          <View style={{gap: 8}}>
            <LocationSearchInput
              value={location}
              onChangeText={setLocation}
              onSelectLocation={setSelectedLocation}
              currentLocStyle={{
                marginTop: 4,
              }}
            />
            {selectedLocation &&
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title={selectedLocation.name}
                    onPress={() =>
                      openGoogleMaps(selectedLocation.latitude, selectedLocation.longitude)
                    }
                  >
                    <MapMarkerIcon/>
                  </Marker>
                </MapView>
              </View>
            }
          </View>
          
          <AppSelect
            value={eventData.sportType}
            onChange={(value) => 
              setEventData((prev) => ({
                ...prev,
                sportType: value
              }))
            }
            placeholder="Sport type"
            options={sports as SportType[]}
            isLoading={loadSports}
            icon={<SportIcon/>}
          />
          <AppTextInput
            value={eventData.players}
            onChangeText={(value)=>
              setEventData((prev) => ({
                ...prev, 
                players: value
              }))
            }
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholder="Players needed"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            leftIcon={<PeopleIcon/>}
          />

          <View style={{gap: 8}}>
            <AppSelect
              value={""}
              onChange={(value) => 
                handleSkillLevel(value)
              }
              placeholder="Select level"
              options={SKILL_LEVEL}
              icon={<SkillIcon/>}
            />
            <View style={styles.levelContainer}>
              {
                eventData.skill_level.map((level: string) => (
                  <View key={level} style={styles.level}>
                    <Text
                      style={{fontSize: FontSize.sm, color: "#424257", textTransform: "capitalize"}}
                    >{level}</Text>
                    <Pressable onPress={()=>handleRemoveLevel(level)}>
                      <Ionicons 
                        name='close' 
                        size={20} 
                        color="#424257"
                      />
                    </Pressable>
                  </View>
                ))
              }
            </View>
          </View>

          <AppTextInput
            value={eventData.description}
            onChangeText={(value)=>
              setEventData((prev) => ({
                ...prev, 
              description: value
              }))
            }
            multiline
            style={{
              minHeight: 100,
              paddingVertical: 16
            }}
            placeholder="Add description"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSection 
        title={eventId ? 'Update' : 'Create Event'}
        bottomHeight={120}
        handleBtn={()=>eventId ? handleUpdateSubmit() : handleSubmit()}
        btnDisabled={isLoading || isDisabled}
        isLoading={isLoading}
      />

      {open && (
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold
              }}
            >
              Your event is live 🎉
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                color: "#585874",
                marginBottom: 50
              }}
            >
              Spread the word, share your event and start{'\n'} 
              welcoming guests onboard
            </Text>
            <View style={{gap: 10, width: "100%"}}>
              <AppButton
                title='Share event'
                onPress={()=>console.log("share")}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
              />
              <AppButton
                title='View event page'
                onPress={()=>closeModal()}
                buttonStyle={{
                  width: "100%", 
                  backgroundColor: Colors.lightPrimary
                }}
                textStyle={{color: Colors.primary, fontFamily: Font.bold}}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  successModal: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalContainer: {
    height: "40%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: Colors.appBg,
    paddingBottom: 20,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  levelContainer: {
    flexDirection: "row",
    gap: 6
  },
  level: {
    minWidth: 99,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EBEBF0",
    borderWidth: 1,
    borderColor: "#C5C5D3",
    borderRadius: 24,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  mapContainer: {
    height: 159,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  editCameraIcon: {
    position: "absolute",
  },
  cameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#0B0B0F",
    borderRadius: 8,
    maxWidth: 134, height: 36,
    marginBottom: 12,
    marginRight: 12,
    flexDirection: "row"
  },
  container: {
    flex: 1
  },
  image: {
    width: 231,
    height: 186,
    borderRadius: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#4B2E2E"
  }
})
