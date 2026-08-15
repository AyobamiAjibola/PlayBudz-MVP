import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/stores/auth.store";
import { Colors, Font, FontSize } from "@/constants/utils";
import Screen from "@/components/Screen";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { useCallback, useState } from "react";
import EventSection from "../components/EventSection";
import { PlayerType } from "../types/types";
import PlayersSection from "../components/PlayersSection";
import RecommendedEventSection from "../components/RecommendedEventSection";
import { router, useFocusEffect } from "expo-router";
import AppModal from "@/components/AppModal";
import NotificationBellIcon from "@/assets/icons/bell.svg"
import LocationIcon from "@/assets/icons/location.svg";
import NotificationIcon from "@/assets/icons/notification.svg";
import Event from "../components/Event";
import { useEvents } from "../hooks/useEvents";
import { useRecommendedEvent } from "../hooks/useRecommendedEvent";
import NoEvent from "@/assets/images/noEvent.svg";
import { AppButton } from "@/components/ui/button";
import { useSavedEvent } from "../hooks/useSavedEvents";
import { usePlayers } from "../hooks/usePlayers";
import SectionHeading from "../components/SectionHeading";

const userImg = require("@/assets/events/user.jpg");

export type EventTab = "Upcoming" | "Saved" | "Past";
const tabs: EventTab[] = ["Upcoming", "Saved", "Past"];

const notificationData = []

export const RenderEmptyEvent = ({
  onPress, message, showBtn=true,
  paddingHorizontal=24, btnText="Search event"
}: {
  onPress?: ()=>void,
  message: string,
  showBtn?: boolean,
  paddingHorizontal?: number,
  btnText?: string
}) => {
  return (
    <View style={[styles.noEventContainer, {paddingHorizontal: paddingHorizontal}]}>
      <View style={styles.noEvent}>
        <NoEvent width={126} height={103}/>
        <Text
          style={{
            textAlign: "center"
          }}
        >
          {message}
        </Text>
        {showBtn && <AppButton
          title={btnText}
          textStyle={{
            color: Colors.primary,
            fontSize: FontSize.sm,
            fontFamily: Font.semiBold
          }}
          buttonStyle={{
            width: 122,
            height: 36,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "#FFE5E5"
          }}
          onPress={onPress}
        />}
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const [selected, setSelected] = useState<EventTab>("Upcoming");
  const [isNotification, setIsNotification] = useState<boolean>(false);
  const [openEvent, setOpenEvent] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");

  const mode =
    selected === "Upcoming"
      ? "upcoming"
      : selected === "Past"
        ? "past"
        : undefined;

  const filter =
    selected === "Saved"
      ? "saved"
      : undefined;

  const {
    events,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEvents({ page: 1, limit: 10, date, filter, status: mode });
  const {
    recommendedEvents,
    isLoading: recIsLoading,
    isFetching: recIsFetching,
    isError: recIsError,
    error: recError,
    refetch: recRefetch,
  } = useRecommendedEvent({ page: 1, limit: 3 });

  const {
    events: savedEvents,
    isLoading: sIsLoading,
    isFetching: sIsFetching,
    isError: sIsError,
    error: sError,
    refetch: sRefetch,
  } = useSavedEvent({ page: 1, limit: 10 });

  const {
    players,
    isLoading: pIsLoading,
    isFetching: pIsFetching,
    isError: pIsError,
    error: pError,
    refetch: pRefetch,
  } = usePlayers({ page: 1, limit: 10 });

  const isSaved = filter === "saved";

  const currentEvents = isSaved ? savedEvents : events;
  const currentLoading = isSaved ? sIsLoading : isLoading;
  const currentFetching = isSaved ? sIsFetching : isFetching;
  const currentRefetch = isSaved ? sRefetch : refetch;
  const currentError = isSaved ? sError : error;
  const currentIsError = isSaved ? sIsError : isError;

  const handleChange = (item: EventTab) => {
    setSelected(item);
  };

  const handleOpenEvent = (edit: boolean) => {
    if(edit) {
      setIsEdit(true)
    } else {
      setIsEdit(false)
    }

    setOpenEvent(true)
  }

  function RenderContent () {
    return (
      <View style={styles.wrapper}>
        <View style={styles.leftContent}>
          <Text 
            style={{
              fontSize: FontSize.sm, 
              fontFamily: Font.semiBold, 
              color: Colors.textGrey, 
              marginBottom: 10
            }}
          >
            Location
          </Text>
          <View style={styles.location}>
            <LocationIcon height={20} width={20}/>
            <TouchableOpacity style={styles.locationBtn}>
              <Text style={{fontSize: FontSize.default, fontFamily: Font.semiBold}}>
                {user?.profile.location?.name}
              </Text>
              <SimpleLineIcons name="arrow-down" size={16} color={Colors.textGrey} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.notification} onPress={()=>setIsNotification(true)}>
          <View style={styles.badge}>
            <Text style={{fontSize: FontSize.xs, fontFamily: Font.semiBold, color: "white"}}>
              2
            </Text>
          </View>
          <NotificationIcon height={24} width={24} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Screen
      showContent={true} 
      RenderContent={RenderContent}
      style={{paddingHorizontal: 0}}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{marginTop: 30}}>
          <View style={{paddingHorizontal: 24}}>
            <SectionHeading title="Your Events" onPress={()=>router.push("/home/events")}/>
          </View>
          <View style={styles.filter}>
            {tabs.map((item) => (
              <TouchableOpacity key={item} onPress={()=>handleChange(item)}>
                <Text
                  style={[styles.filterBtn, {
                    color: selected === item ? "white" : "#585874",
                    fontFamily: selected === item ? Font.semiBold : Font.regular,
                    backgroundColor: selected === item ? "#1A0000" : "#EBEBF0"
                  }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {currentEvents.length > 0 
            ? ( <EventSection
                  events={currentEvents}
                  isLoading={currentLoading}
                  isFetching={currentFetching}
                  refetch={currentRefetch}
                  isError={currentIsError}
                  error={currentError}
                />
              ) : (
                <RenderEmptyEvent
                  onPress={()=>router.push('/home/discover-events')}
                  message={`Search and Explore events related ${"\n"} to your interests nearby`
                  }
                />
              )
          }
        </View>

        <View style={{marginTop: 40}}>
          <View style={{paddingHorizontal: 24}}>
            <SectionHeading title="Players like you" onPress={()=>router.push("/home/discover-players")}/>
          </View>
          {
            players.length
              ? (
                <PlayersSection players={players} />
              ) : (
                <RenderEmptyEvent
                  onPress={()=>router.push('/home/discover-events')}
                  message={`No players`}
                  showBtn={false}
                />
              )
          }
        </View>

        <View 
          style={{
            marginTop: 30, 
            paddingHorizontal: 24
          }}
        >
          <SectionHeading title="Recommended events" onPress={()=>router.push("/search")}/>
          {
            recommendedEvents.length
            ? (
              <RecommendedEventSection events={recommendedEvents} />
            ) : (
              <RenderEmptyEvent
                showBtn={false}
                paddingHorizontal={0}
                message={`Search and Explore events related ${"\n"} to your interests nearby`}
              />
            )
          }
          
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={()=>router.push('/event/create')}
        style={styles.addEvent}
      >
        <AntDesign name="plus" size={14} color="white" />
        <Text
          style={{
            color: "white"
          }}
        >Create event</Text>
      </TouchableOpacity>

      <AppModal
        visible={isNotification}
        setVisible={setIsNotification}
      >
        <View style={styles.modalContainer}>
          <View className="px-6" style={[styles.container, { height: "auto"}]}>
            <View style={styles.notificationWrapper}>
              <SimpleLineIcons name="arrow-left" size={19} color="black" onPress={()=>setIsNotification(false)} style={{marginTop: 10}}/>
              <Text style={styles.title}>
                Notification
              </Text>
            </View>
          </View>
          {!notificationData.length && <View style={styles.emptyNotification}>
            <NotificationBellIcon height={64} width={64} />
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.extraBold,
              }}
            >
              No notifications
            </Text>
            <Text
              style={{
                fontSize: FontSize.sm,
                color: Colors.textGrey,
                textAlign: "center"
              }}
            >
              You have no notifications yet.{"\n"} 
              When you get a notification, it will appear here.
            </Text>
          </View>}
        </View>
      </AppModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  noEventContainer: {
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 16
  },
  noEvent: {
    height: 277,
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "white"
  },
  addEvent:{
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 140,
    height: 36,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: "row",
    gap: 4
  },
  notificationWrapper: {
    display: "flex",
    flexDirection: "row", 
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    marginTop: 50, marginBottom: 20,
  },
  emptyNotification: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 6
  },
  title: {
    fontFamily: Font.bold, 
    fontSize: FontSize.lg, 
    marginTop: 10
  },
  modalContainer: {
    height: "100%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: Colors.appBg,
    paddingBottom: 20
  },
  notificationContainer: {

  },
  container: {
    display: "flex",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -0.2, // Negative for shadow above
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 6,
  },
  wrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 50, marginBottom: 20,
    flexDirection: "row"
  },
  leftContent: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  location: {
    display: "flex", 
    justifyContent: "flex-start", 
    alignItems: "center", 
    flexDirection: "row",
    gap: 10
  },
  locationBtn: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  notification: {
    position: "relative"
  },
  badge: {
    backgroundColor: "red",
    position: "absolute",
    top: -4,
    bottom: 0,
    left: 12,
    borderRadius: "100%",
    zIndex: 999,
    width: 15,
    height: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  filter: {
    display: "flex",
    gap: 12,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 24  },
  filterBtn: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8
  }
})
