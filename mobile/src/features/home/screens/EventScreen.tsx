import { Text } from '@/components/ui/text'
import { Colors, Font, FontSize } from '@/constants/utils'
import { SimpleLineIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import MoreIcon from "@/assets/icons/more.svg"
import { useEvent } from '../hooks/useEvent'
import { Image } from 'expo-image'
import ClockIcon from "@/assets/icons/clock_.svg"
import PeopleIcon from "@/assets/icons/people.svg"
import MapView, { Marker } from "react-native-maps";
import { Interest, Participant, Player } from '../types/types'
import BottomSection from '@/features/auth/components/BottomSection'
import { useAuthStore } from '@/stores/auth.store'
import { useJoinEvent } from '../hooks/useJoinEvent'
import { AppButton } from '@/components/ui/button'
import CreateChatIcon from "@/assets/icons/CreateChat.svg"
import EditEventIcon from "@/assets/icons/EditEvent.svg"
import ShareEventIcon from "@/assets/icons/ShareEvent.svg"
import CloseEventIcon from "@/assets/icons/OpenEvent.svg"
import CancelEventIcon from "@/assets/icons/CancelEvent.svg"
import { api } from '@/api/axios'
import AppModal from '@/components/AppModal'
import WarnIcon from "@/assets/icons/Warn.svg"
import Toast from 'react-native-toast-message'

const fallbackImage = (require("@/assets/events/3.jpg"));
const creatorFallbackImage = require("@/assets/events/user.jpg") 

export interface EventType {
  image: string;
  eventName: string;
  eventDateTime: string;
  sportType: string;
  players: string;
  skill_level: string[];
  description?: string;
}

const formatEventDate = (date: string) => {
  return new Date(date)
    .toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
}

export default function EventScreen({eventId}: {eventId: string}) {
  const [open, setOpen] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const profile = useAuthStore((state) => state.user);
  const [joined, setJoined] = useState<boolean>(false);
  const [closed, setClosed] = useState<boolean>(false);
  const [canceled, setCanceled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [askToJoin, setAskToJoin] = useState<boolean>(false);
  const [askToLeave, setAskToLeave] = useState<boolean>(false);

  const {
    joinEvent,
    isLoading: jIsLoading,
    isError: jIsError,
    error: jError,
  } = useJoinEvent();

  const {
    event,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEvent(eventId);

  const eventImg = `${process.env.EXPO_PUBLIC_SERVER}${event?.image}`;
  const creatorImg = `${process.env.EXPO_PUBLIC_SERVER}${event?.creator.image}`;
  const description = event?.description?.split(" ") ?? [];
  const isLongDescription = description.length > 12;
  const hasJoinedChat = false;

  const displayedDescription =
    showFullDescription || !isLongDescription
      ? description.join(" ")
      : `${description.slice(0, 12).join(" ")}...`;
  
  const handleJoin = () => {
    joinEvent(eventId, {
      onSuccess: (data) => {
        setAskToJoin(false)
        refetch()
        setJoined(true)
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: (error as Error).message
        });
      },
    });
  };

  const toggleCloseGame = async () => {
    setLoading(true)
    try {
      const response = await api.patch(`/games/toggle-closed-state?gameId=${event?.id}`)

      if(response.data.success) {
        refetch()
        setClosed(false)
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message
      });
    } finally {
      setLoading(false)
    }
  }

  const cancelGame = async () => {
    setLoading(true)
    try {
      const response = await api.patch(`/games/cancel-game?gameId=${event?.id}`)

      if(response.data.success) {
        refetch()
        setCanceled(false)
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message
      });
    } finally {
      setLoading(false)
    }
  }

  const leaveGame = async () => {
    setLoading(true)
    try {
      const response = await api.delete(`/games/${event?.id}/leave`)

      if(response.data.success) {
        refetch()
        setAskToLeave(false)
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: (error as Error).message
      });
    } finally {
      setLoading(false)
    }
  }

  const BottomButtonContent = [
    {
      title: "Create Chat",
      onPress: ()=>console.log("create"),
      icon: <CreateChatIcon/>
    },
    {
      title: "Edit Event",
      onPress: ()=> router.push(`/event/${[eventId]}/edit`),
      icon: <EditEventIcon/>
    },
    {
      title: "Share Event",
      onPress: ()=>console.log("create"),
      icon: <ShareEventIcon/>
    },
    {
      title: event?.closed ? "Open Event" : "Close Event",
      onPress: ()=>setClosed(true),
      icon: <CloseEventIcon/>
    },
    {
      title: event?.cancelled ? "Canceled" : "Cancel Event",
      onPress: ()=>setCanceled(true),
      icon: <CancelEventIcon/>
    }
  ]


  const hasJoined = event?.participants?.some(
    (participant) => participant.userId === profile?.profile.id
  ) ?? false;

  const RenderPlayer = ({player}: {player: Player}) => {
    const sports = player.interests?.filter((game: Interest) => game.interest) ?? []

    return (
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 10
        }}
      >
        <View style={styles.creator}>
          <View style={{height: 48, width: 48}}>
            <Image
              source={
                  player.image
                  ? { uri: creatorImg }
                  : creatorFallbackImage
              }
              alt="creator image"
              contentFit="cover"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "100%"
              }}
            />
          </View>
          <View>
            <Text style={{fontFamily: Font.semiBold}}>
              {player.fullName}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                flexShrink: 1,
                fontSize: FontSize.xs,
                color: Colors.darkGrey,
              }}
            >
              {sports
                .map((sport: Interest) =>
                  sport.interest.split(" ").slice(1).join(" ")
                )
                .join(" • ")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: Colors.lightPrimary,
            width: 63, height: 36,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 24
          }}
        >
          <Text style={{
              fontSize: FontSize.sm, 
              fontFamily: Font.semiBold,
              color: Colors.primary
            }}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const RenderBottomButtons = () => {
    return (
      <View style={{marginBottom: 20, marginTop: 40}}>
        <Text
          style={{
            color: Colors.darkGrey,
            fontFamily: Font.regular,
            marginBottom: 5
          }}
        >
          Manage event
        </Text>

        <View style={styles.divider} />

        <View style={styles.bottomBtn}>
          {BottomButtonContent.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.wrap, {
                backgroundColor: item.title.includes('Cancel') && event?.cancelled
                      ? Colors.bgGrey
                      : "white",
              }]}
              onPress={item.onPress}
              activeOpacity={0.7}
              disabled={item.title.includes('Cancel') && event?.cancelled}
            >
              {item.icon}

              <Text 
                style={[styles.buttonText, {
                  color: item.title.includes('Cancel') 
                          ? Colors.primary : Colors.darkGrey,
                }]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if(isLoading) {
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
    <View style={{flex: 1}}>
      <View className="px-6" style={[styles.container, { height: "auto", zIndex: 999}]}>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={()=>router.back()}>
            <SimpleLineIcons 
              name="arrow-left" 
              size={19} color="black" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpen((prev) => !prev)}>
            <MoreIcon/>
          </TouchableOpacity>
          {open && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={[styles.option, ]}
                onPress={() => {
                  setOpen(false);
                  console.log("Edit");
                }}
              >
                <Text
                  style={{
                    fontSize: 17
                  }}
                >Add to calendar</Text>
              </TouchableOpacity>
              <View style={{width: '100%', height: 0.4, backgroundColor: "#8080808C"}} />
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setOpen(false);
                  console.log("Delete");
                }}
              >
                <Text
                  style={{
                    fontSize: 17
                  }}
                >{event?.creatorId !== profile?.profile.id ? "Join event chat" : "Event chat"}</Text>
              </TouchableOpacity>
              <View style={{width: '100%', height: 0.4, backgroundColor: "#8080808C"}} />
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setOpen(false);
                  console.log("Delete");
                }}
              >
                <Text
                  style={{
                    fontSize: 17
                  }}
                >Share event</Text>
              </TouchableOpacity>
              {event?.creatorId !== profile?.profile.id &&
                <>
                  <View style={{width: '100%', height: 0.4, backgroundColor: "#8080808C"}} />
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      setOpen(false);
                      hasJoined ? setAskToLeave(true) : setAskToJoin(true);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: 'red'
                      }}
                    >{hasJoined 
                      ? 'Leave event' 
                      : event?.cancelled ? 'Event is canceled' : 'Join event'}
                    </Text>
                  </TouchableOpacity>
                </>
              }
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={[{ 
          flexGrow: 1,
          paddingHorizontal: 24,
          marginTop: 10,
          paddingBottom: 40
        }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "100%", height: 217, borderRadius: 8 }}>
          <Image
            source={
                event?.image
                  ? { uri: eventImg }
                  : fallbackImage
            }
            style={{ height: "100%", borderRadius: 16 }}
            contentFit="cover"
          />
        </View>
        
        <View style={styles.sport}>
          <Text style={{fontFamily: Font.semiBold, fontSize: FontSize.md}}>
            {event?.sport}
          </Text>
        </View>

        <View style={{gap: 12, marginTop: 20}}>
          <Text style={styles.eventTitle}>
            {event?.title}
          </Text>
          <View style={styles.eventDetails}>
            <ClockIcon height={24} width={24}/>
            <Text style={{fontSize: FontSize.md}}>
              {formatEventDate(event?.gameDateTime as string)}
            </Text>
          </View>
          <View style={styles.eventDetails}>
            <PeopleIcon height={24} width={24}/>
            <Text style={{fontSize: FontSize.md}}>
              {event?.players} players needed
            </Text>
          </View>
        </View>

        <View style={styles.eventSection}>
          <Text style={{color: Colors.darkGrey}}>
            Location
          </Text>
          <View 
            style={{
              width: "100%", 
              height: 2, 
              backgroundColor: Colors.bgGrey, 
              marginTop: 4,
              marginBottom: 10
            }}
          />
          <Text
            style={{
              fontFamily: Font.bold
            }}
          >
            Address
          </Text>
          <Text>
            {event?.location.name}
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: event?.location.latitude as number,
                longitude: event?.location.longitude as number,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: event?.location.latitude as number,
                  longitude: event?.location.longitude as number,
                }}
                title={event?.location.name}
              />
            </MapView>
          </View>
        </View>

        <View style={styles.eventSection}>
          <Text style={{color: Colors.darkGrey}}>
            About event
          </Text>
          <View 
            style={{
              width: "100%", 
              height: 2, 
              backgroundColor: Colors.bgGrey, 
              marginTop: 4,
              marginBottom: 10
            }}
          />
          <Text>
            {description.length > 0
              ? displayedDescription
              : "No about"}
          </Text>

          {isLongDescription && (
            <Pressable
              onPress={() => setShowFullDescription((prev) => !prev)}
            >
              <Text
                style={{
                  fontFamily: Font.bold,
                  color: Colors.primary,
                }}
              >
                {showFullDescription ? "Read less" : "Read more"}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.eventSection}>
          <Text style={{color: Colors.darkGrey}}>
            Skill level
          </Text>
          <View 
            style={{
              width: "100%", 
              height: 2, 
              backgroundColor: Colors.bgGrey, 
              marginTop: 4,
              marginBottom: 10
            }}
          />
          <View style={{gap: 4, flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
            {
              JSON.parse(event?.skill_level as string).map((skill: string) => (
                <View key={skill} style={styles.pill}>
                  <Text style={{fontSize: FontSize.sm, textAlign: "center", textTransform: "capitalize"}}>
                    {skill}
                  </Text>
                </View>
              ))
            }
          </View>
        </View>

        <View style={styles.eventSection}>
          <Text style={{color: Colors.darkGrey}}>
            People in this event
          </Text>
          <View 
            style={{
              width: "100%", 
              height: 2, 
              backgroundColor: Colors.bgGrey, 
              marginTop: 4,
              marginBottom: 10
            }}
          />
          <Text
            style={{
              fontFamily: Font.bold
            }}
          >
            Created by
          </Text>
          <RenderPlayer player={event?.creator as Player}/>

          <Text
            style={{
              fontFamily: Font.bold,
              marginTop: 30 
            }}
          >
            {`Going ( ${event?.participants?.length})`}
          </Text>
          {event?.participants.map((participant: Participant) => (
            <View key={participant.id}>
              <RenderPlayer player={participant.user as Player}/>
            </View>
          ))}
        </View>

        {event?.creatorId === profile?.profile.id && <RenderBottomButtons/>}
      </ScrollView>

      {joined && (
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold
              }}
            >
              Successfully joined event 🎉
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                color: "#585874",
                marginBottom: 50
              }}
            >
              You have joined the{" "}
              <Text 
                style={{fontFamily: Font.semiBold}}
              >{event?.title},</Text> {'\n'} 
              <Text 
                style={{fontFamily: Font.semiBold}}
              >{event?.players} players needed</Text>{" "}event.
            </Text>
            <View style={{gap: 10, width: "100%"}}>
              <AppButton
                title='Add to calendar'
                onPress={()=>console.log("share")}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
              />
              <AppButton
                title='View event'
                onPress={()=>setJoined(false)}
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

      {closed && (
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <CloseEventIcon height={56} width={56}/>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold,
                marginTop: 30
              }}
            >
              Close this event?
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                color: "#585874",
                marginBottom: 50
              }}
            >
              Are you sure you want to close this event ? 
              New participants will no longer be able 
              to join this event.
            </Text>
            <View style={{gap: 10, width: "100%"}}>
              <AppButton
                title='Close event'
                onPress={toggleCloseGame}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
                isLoading={loading}
                disabled={loading}
              />
              <AppButton
                title='Cancel'
                onPress={()=>setClosed(false)}
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

      {canceled && (
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <CancelEventIcon height={56} width={56}/>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold,
                marginTop: 30
              }}
            >
              Cancel this event?
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                color: "#585874",
                marginBottom: 50
              }}
            >
              Are you sure you want to cancel this event ? 
              This event will cancelled and removed and 
              participants will be notified.
            </Text>
            <View style={{gap: 10, width: "100%"}}>
              <AppButton
                title='Cancel event'
                onPress={cancelGame}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
                isLoading={loading}
                disabled={loading}
              />
              <AppButton
                title='Cancel'
                onPress={()=>setCanceled(false)}
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

      {askToLeave && (
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <CloseEventIcon height={56} width={56}/>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold,
                marginTop: 30
              }}
            >
              Leave this event?
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 8,
                color: "#585874",
                marginBottom: 50
              }}
            >
              Are you sure you want to leave this event ? 
              You will no longer have access to event chats.
            </Text>
            <View style={{gap: 10, width: "100%"}}>
              <AppButton
                title='Leave event'
                onPress={leaveGame}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
                isLoading={loading}
                disabled={loading}
              />
              <AppButton
                title='Cancel'
                onPress={()=>setAskToLeave(false)}
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

      {event?.creatorId !== profile?.profile.id && !hasJoined && (
        <BottomSection
          handleBtn={()=>setAskToJoin(true)}
          title={event?.cancelled ? "Event is canceled" : "Join event"}
          isLoading={jIsLoading}
          btnDisabled={jIsLoading || event?.cancelled}
        />
      )}

      <AppModal
        visible={askToJoin}
        setVisible={setAskToJoin}
      >
        <View style={styles.modalContainer}>
          <View style={styles.askToJoin}>
            <WarnIcon height={56} width={56}/>
            <Text
              style={{
                fontSize: FontSize.lg,
                fontFamily: Font.bold,
                marginTop: 20,
                marginBottom: 10
              }}
            >
              Stay safe and respect others
            </Text>
            <Text style={styles.askToJoinText}>
              Before joining this event, please keep in mind:
            </Text>
            <View style={{ gap: 4, marginTop: 10, marginBottom: 15 }}>
              <Text style={styles.askToJoinText}>• Meet in public places</Text>
              <Text style={styles.askToJoinText}>• Be respectful, harassment won't be tolerated</Text>
              <Text style={styles.askToJoinText}>• Stay alert and report any suspicious behaviour</Text>
            </View>
            <Text style={styles.askToJoinText}>
              By joining this event, you agree to follow our 
              <Text
                style={{
                  fontFamily: Font.bold,
                  textDecorationLine: "underline"
                }}
              >community guidelines</Text> and 
              <Text
                style={{
                  fontFamily: Font.bold,
                  textDecorationLine: "underline"
                }}
              >safety terms</Text>
            </Text>

            <View style={{gap: 10, width: "100%", marginTop: 60}}>
              <AppButton
                title='Join event'
                onPress={handleJoin}
                buttonStyle={{width: "100%"}}
                textStyle={{fontFamily: Font.bold}}
                isLoading={loading}
                disabled={loading}
              />
              <AppButton
                title='Cancel'
                onPress={()=>setAskToJoin(false)}
                buttonStyle={{
                  width: "100%", 
                  backgroundColor: Colors.lightPrimary
                }}
                textStyle={{color: Colors.primary, fontFamily: Font.bold}}
              />
            </View>
          </View>
        </View>
      </AppModal>
    </View>
  )
}

const styles = StyleSheet.create({
  askToJoinText: {
    color: Colors.darkGrey
  },
  askToJoin: {
    justifyContent: "flex-start"
  },
  modalContainer: {
    height: "60%",
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: Colors.appBg,
    paddingBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 40
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.bgGrey,
    marginTop: 4,
    marginBottom: 10,
  },
  bottomBtn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wrap: {
    width: "31.5%",
    minHeight: 106,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "space-between"
  },
  buttonText: {
    fontFamily: Font.bold,
    fontSize: FontSize.sm,
  },
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
  creator: {
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  },
  pill: {
    alignSelf: "flex-start",
    minWidth: 75,
    height: 38,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.bgGrey,
    borderWidth: 1,
    borderColor: "#C5C5D3",
    borderRadius: 24
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  eventSection: {
    gap: 6,
    marginTop: 40
  },
  eventDetails: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: Font.extraBold
  },
  sport: {
    height: 40,
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: "#CCFFCC",
    backgroundColor: "#E5FFE5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10
  },
  wrapper: {
    display: "flex",
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 70, marginBottom: 20,
    position: "relative",
    zIndex: 100,
  },
  dropdown: {
    position: "absolute",
    top: 28,
    right: 0,
    width: 250,
    minHeight: 88,
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: "flex-start",
    justifyContent: "center",
    
    // iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Android
    elevation: 5,
    backgroundColor: "white",
    zIndex: 9999,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontFamily: Font.bold, 
    fontSize: FontSize.lg, 
    marginTop: 10
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
})
