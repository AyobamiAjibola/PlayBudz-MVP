import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "@/stores/auth.store";
import { Colors, Font, FontSize } from "@/constants/utils";
import Screen from "@/components/Screen";
import { Image } from "expo-image";
import { SimpleLineIcons } from "@expo/vector-icons";
import SectionHeading from "../components/Sectionheading";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import EventSection from "../components/EventSection";
import { EventType, PlayerType } from "../types/types";
import PlayersSection from "../components/PlayersSection";
import RecommendedEventSection from "../components/RecommendedEventSection";
import { router } from "expo-router";
import AppModal from "@/components/AppModal";

const locationIcon = require("@/assets/icons/location.svg");
const notification = require("@/assets/icons/notification.svg");
const eventImg1 = require("@/assets/events/1.jpg")
const eventImg2 = require("@/assets/events/2.jpg")
const eventImg3 = require("@/assets/events/3.jpg")
const userImg = require("@/assets/events/user.jpg")
const notificationBell = require("@/assets/icons/bell.svg")

export const events: EventType[] = [
  {
    id: "1",
    image: eventImg1,
    createdBy: {
        name: "Tony",
        profileImage: userImg
    },
    sport: "🏸 Badminton",
    title: "One player neeed for a Badminton game at Alberta, Canada",
    date: "March 28",
    time: "3:00pm",
    location: "Alberta, Canada"
  },
  {
    id: "2",
    image: eventImg2,
    createdBy: {
        name: "Tony",
        profileImage: userImg
    },
    sport: "🏸 Badminton",
    title: "One player neeed for a Badminton game at Alberta, Canada",
    date: "March 28",
    time: "3:00pm",
    location: "Alberta, Canada"
  },
  {
    id: "3",
    image: eventImg3,
    createdBy: {
        name: "Tony",
        profileImage: userImg
    },
    sport: "🏸 Badminton",
    title: "Basketball game event at the stadium, 5 players needed",
    date: "March 28",
    time: "3:00pm",
    location: "Alberta, Canada"
  },
   {
    id: "4",
    image: eventImg3,
    createdBy: {
        name: "Tony",
        profileImage: userImg
    },
    sport: "🏸 Badminton",
    title: "Basketball game event at the stadium, 5 players needed",
    date: "March 28",
    time: "3:00pm",
    location: "Alberta, Canada"
  }
];

export const players: PlayerType[] = [
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "1",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "2",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "3",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "4",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "5",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "6",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "7",
    photo: userImg
  },
  {
    fullname: "Tony Smith",
    interests: JSON.stringify([{"interest":"🏀 Basket ball","skill_level":"Beginner"},{"interest":"🥌 Curling","skill_level":"Intermediate"}]),
    chatId: "8",
    photo: userImg
  }
]

const notificationData = []

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const location = JSON.parse(user?.profile.location ?? "");
  const [selected, setSelected] = useState<string>("Upcoming");
  const [isNotification, setIsNotification] = useState<boolean>(false)

  const filter = ["Upcoming", "Saved", "Past"];

  const handleChange = (item: string) => {
    setSelected(item)
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
            <Image
              source={locationIcon}
              alt="location"
              style={{height: 20, width: 20}}
            />
            <TouchableOpacity style={styles.locationBtn}>
              <Text style={{fontSize: FontSize.default, fontFamily: Font.semiBold}}>
                {location.name}
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
          <Image
            source={notification}
            alt="location"
            style={{height: 24, width: 24}}
          />
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
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        // style={styles.container}
      >
        <View style={{marginTop: 30}}>
          <View style={{paddingHorizontal: 24}}>
            <SectionHeading title="Your Events" onPress={()=>router.push("/(app)/home/events")}/>
          </View>
          <View style={styles.filter}>
            {filter.map((item) => (
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

          <EventSection events={events} />
        </View>

        <View style={{marginTop: 40}}>
          <View style={{paddingHorizontal: 24}}>
            <SectionHeading title="Players like you" onPress={()=>router.push("/home/discover-players")}/>
          </View>
          <PlayersSection players={players} />
        </View>

        <View style={{marginTop: 30, paddingHorizontal: 24}}>
          <SectionHeading title="Recommended events" onPress={()=>router.push("/home/discover-events")}/>
          <RecommendedEventSection events={events} />
        </View>
      </ScrollView>

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
            <Image
              source={notificationBell}
              alt="Notification"
              style={{
                height: 64,
                width: 64
              }}
            />
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
