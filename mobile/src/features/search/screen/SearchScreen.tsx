import AppTextInput from '@/components/AppTextInput'
import { Text } from '@/components/ui/text'
import { ActivityIndicator, Dimensions, FlatList, Linking, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import FilterIcon from '@/assets/icons/Filter.svg'
import SearchIcon from "@/assets/icons/search.svg"
import { Colors, Font, FontSize } from '@/constants/utils'
import { useRef, useState } from 'react'
import { useEvents } from '@/features/home/hooks/useEvents'
import { RenderEmptyEvent } from '@/features/home/screens/HomeScreen'
import { router } from 'expo-router'
import EventCard from '@/features/home/components/EventCard'
import { usePlayers } from '@/features/home/hooks/usePlayers'
import PlayerCard from '@/features/home/components/PlayerCard'
import { useRecommendedEvent } from '@/features/home/hooks/useRecommendedEvent'
import AppModal from '@/components/AppModal'
import { Ionicons } from '@expo/vector-icons'
import { LocationSearchInput, SelectedLocation } from '@/components/LocationSearchInput'
import { useFetchSports } from '@/features/home/hooks/useFetchSports'
import MenuIcon from "@/assets/icons/menu.svg"
import EventSection from '@/features/home/components/EventSection'
import MapIcon from "@/assets/icons/map-icon.svg"
import MapView, { Marker } from "react-native-maps";
import { useAuthStore } from '@/stores/auth.store'
import { Game } from '@/features/home/types/types'
import MapMarkerIcon from "@/assets/icons/map-marker.svg"

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48

const SCREEN_PADDING = 16;
const CARD_SPACING = 12;

const P_CARD_WIDTH =
  (width - SCREEN_PADDING * 2 - CARD_SPACING) / 2;

type FilterType = {
    date: string;
    skill_level: string;
    sport: string;
}

type DateFilter =
  | "Any day"
  | "Today"
  | "Tomorrow"
  | "This week"
  | "This weekend";

type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Expert";

const dateOptions: DateFilter[] = [
  "Any day",
  "Today",
  "Tomorrow",
  "This week",
  "This weekend",
];

const skillOptions: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Expert",
];

export default function SearchScreen() {
    const [activeTab, setActiveTab] = useState<string>("Events");
    const [search, setSearch] = useState<string>("");
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [location, setLocation] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [filter, setFilter] = useState<FilterType>({
        date: "",
        skill_level: "",
        sport: ""
    });
    const [selectedDate, setSelectedDate] = useState<DateFilter>("Any day");
    const [selectedSkills, setSelectedSkills] = useState<SkillLevel[]>([]);
    const [selectedSports, setSelectedSports] = useState<string[]>(["Canadian football"]);
    const [showAllSports, setShowAllSports] = useState(false);
    const [listView, setListView] = useState<boolean>(true)
    const profile = useAuthStore((state) => state.user?.profile);
    const mapRef = useRef<MapView>(null);

    const {
        sportStr: sportOptions,
        isLoading: loadSports
      } = useFetchSports();

    const visibleSports = showAllSports
        ? sportOptions
        : sportOptions.slice(0, 3);

    const toggleSkill = (value: SkillLevel) => {
        setSelectedSkills((prev) =>
        prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
    };

    const toggleSport = (value: string) => {
        setSelectedSports((prev) =>
        prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
    };

    const {
        events,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useEvents({ page: 1, limit: 10, date: filter.date, search });

    const PopularSearches = [
        {search: "Events near me", onPress: ()=>console.log('loc')},
        {search: "Players with similar interests", onPress: ()=>console.log('loc')},
        {search: "Calgary, Alberta", onPress: ()=>console.log('loc')}
    ]

    const handleResetFilter = () => {
        setFilter({
            date: "",
            skill_level: "",
            sport: ""
        })
    }

    const {
        players,
        isLoading: pIsLoading,
        isFetching: pIsFetching,
        isError: pIsError,
        error: pError,
        refetch: pRefetch,
    } = usePlayers({ page: 1, limit: 10, search });

    const eventLocations = events.map((e: Game) => ({
        name: e.location.name,
        latitude: e.location.latitude,
        longitude: e.location.longitude
    }));

    const coordinates = events
        .filter((event) => event.location)
        .map((event) => ({
            latitude: event.location!.latitude,
            longitude: event.location!.longitude,
        }));
    
    const openGoogleMaps = (
        latitude: number,
        longitude: number,
    ) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

        Linking.openURL(url);
    };

    const RenderMapView = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: profile?.location?.latitude as number,
                            longitude: profile?.location?.longitude as number,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        onMapReady={() => {
                            if (coordinates.length > 0) {
                            mapRef.current?.fitToCoordinates(coordinates, {
                                edgePadding: {
                                    top: 50,
                                    right: 50,
                                    bottom: 50,
                                    left: 50,
                                },
                                animated: true,
                            });
                            }
                        }}
                    >
                        {eventLocations.map((loc, index: number) => {
                            if (!loc) return null;

                            return (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: loc.latitude,
                                        longitude: loc.longitude,
                                    }}
                                    title={loc.name}
                                    onPress={() =>
                                        openGoogleMaps(loc.latitude, loc.longitude)
                                    }
                                >
                                    <MapMarkerIcon/>
                                </Marker>
                            );
                        })}
                    </MapView>
                </View>
                
                <View style={styles.eventMapContainer}>
                    <EventSection
                        events={events}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        refetch={refetch}
                        isError={isError}
                        error={error}
                        homeScreen={false}
                    />
                </View>
            </View>
        )
    }

    const RenderEvents = () => {
        return (
            <FlatList
                style={{ flex: 1, paddingHorizontal: 24 }}
                data={events}
                keyExtractor={(item) => item.id as string}
                refreshing={isFetching}
                onRefresh={refetch}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <EventCard item={item} cardWidth={CARD_WIDTH}/>
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <RenderEmptyEvent
                        onPress={()=>router.push('/home')}
                        message={
                            `No events at this time`
                        }
                        btnText={"Home"}
                    />
                }
            />
        )
    }

    const RenderPlayers = () => {
        return (
            <FlatList
                style={{ flex: 1, paddingHorizontal: 24 }}
                data={players}
                refreshing={pIsFetching}
                onRefresh={pRefetch}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id as string}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: CARD_SPACING,
                    gap: 8
                }}
                decelerationRate="fast"
                contentContainerStyle={styles.plistContent}
                renderItem={({ item }) => (
                    <PlayerCard item={item} cardWidth={P_CARD_WIDTH}/>
                )}
                ListEmptyComponent={
                    <RenderEmptyEvent
                        onPress={()=>router.push('/home')}
                        message={
                            `No players`
                        }
                        btnText={"Home"}
                    />
                }
            />
        )
    }

    if(isLoading || pIsLoading) {
        return (
            <View
                style={{
                    paddingHorizontal: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 200
                }}
            >
                <ActivityIndicator/>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>
            <View className="px-6" style={[styles.container, { height: 190}]}>
                <View style={styles.filterContainer}>
                    <View
                        style={{
                            width: "85%"
                        }}
                    >
                        <Pressable style={styles.search}
                            onPress={()=>setOpenSearch(true)}
                        >
                            <SearchIcon />
                            <Text
                                style={{
                                    color: "#A8A8BD"
                                }}
                            >
                                Search events, people...
                            </Text>
                        </Pressable>
                    </View>

                    <TouchableOpacity onPress={()=>setOpenFilter(true)}>
                        <FilterIcon />
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: "row", width: "100%", marginTop: 10}}>
                    {
                        ["Events", "Players"].map((tab) => (
                            <Pressable key={tab}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderBottomColor: activeTab === tab ? Colors.primary : "none",
                                    borderBottomWidth: activeTab === tab ? 2 : 0,
                                    flex: 1,
                                    height: 49
                                }}
                                onPress={()=>setActiveTab(tab)}
                            >
                                <Text 
                                    style={{
                                        fontFamily: Font.bold,
                                        color: activeTab === tab ? Colors.primary : "#A8A8BD"
                                    }}
                                >
                                    {tab}
                                </Text>
                            </Pressable>
                        ))
                    }
                </View>
            </View>

            <View style={{ flex: 1 }}>
                {
                    activeTab === "Events" 
                        ? ( 
                            listView ? <RenderEvents/> : <RenderMapView/>
                        )
                        : ( <RenderPlayers/> )
                }

                <TouchableOpacity
                    onPress={()=>setListView(!listView)}
                    style={styles.floatingStyle}
                >
                    {listView ? <MapIcon/> : <MenuIcon/>}
                    <Text
                        style={{
                            color: "white"
                        }}
                    >{listView ? 'Map view' : 'List view'}</Text>
                </TouchableOpacity>
            </View>

            <AppModal
                visible={openSearch}
                setVisible={setOpenSearch}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalTop}/>

                    <View className='px-6' style={styles.content}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: FontSize.lg,
                                    fontFamily: Font.bold
                                }}
                            >Search</Text>

                            <TouchableOpacity onPress={()=>setOpenSearch(false)}>
                                <Ionicons name='close' color={"#939DB1"}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{gap: 12, marginTop: 30}}>
                            <AppTextInput
                                placeholder='Search events, people...'
                                leftIcon={<SearchIcon />}
                                rightIcon={search && <Ionicons name="close-circle" size={20} color="#939DB1"/>}
                                onPressRightIcon={()=>setSearch("")}
                                value={search}
                            />
                            <LocationSearchInput
                                value={location}
                                onChangeText={setLocation}
                                onSelectLocation={setSelectedLocation}
                                currentLocStyle={{
                                marginTop: 4,
                                }}
                            />
                        </View>

                        <Text
                            style={{
                                fontFamily: Font.bold,
                                color: "#7C7C9C",
                                marginBottom: 20,
                                marginTop: 40
                            }}
                        >
                            Popular searches
                        </Text>
                        <View 
                            style={{
                                justifyContent: "flex-start", 
                                alignItems: "flex-start",
                                gap: 12
                            }}
                        >
                            {
                                PopularSearches.map((s, index) => (
                                    <Pressable key={index}
                                        style={{
                                            gap: 16,
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            flexDirection: "row"
                                        }}
                                        onPress={s.onPress}
                                    >
                                        <SearchIcon />
                                        <Text>
                                            {s.search}
                                        </Text>
                                    </Pressable>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </AppModal>

            <AppModal
                visible={openFilter}
                setVisible={setOpenFilter}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalTop}/>

                    <View style={styles.filter}>
                        <View className='px-6' style={styles.content}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: FontSize.lg,
                                        fontFamily: Font.bold
                                    }}
                                >Filter by</Text>

                                <TouchableOpacity onPress={()=>setOpenFilter(false)}>
                                    <Ionicons name='close' color={"#939DB1"}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView
                                style={{flex: 1}}
                                contentContainerStyle={{
                                    gap: 30,
                                    paddingBottom: 50,
                                    paddingTop: 30,
                                }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Date */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Date</Text>

                                    {dateOptions.map((item) => {
                                        const selected = selectedDate === item;

                                        return (
                                            <Pressable
                                                key={item}
                                                style={styles.row}
                                                onPress={() => setSelectedDate(item)}
                                            >
                                                <Text style={styles.label}>{item}</Text>

                                                <View
                                                    style={[
                                                        styles.radioOuter,
                                                        selected && styles.radioOuterSelected,
                                                    ]}
                                                >
                                                    {selected && <View style={styles.radioInner} />}
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                {/* Skill level */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>
                                        Skill level
                                    </Text>

                                    {skillOptions.map((item) => {
                                        const selected = selectedSkills.includes(item);

                                        return (
                                            <Pressable
                                                key={item}
                                                style={styles.row}
                                                onPress={() => toggleSkill(item)}
                                            >
                                                <Text style={styles.label}>{item}</Text>

                                                <View
                                                    style={[
                                                        styles.checkbox,
                                                        selected && styles.checkboxSelected,
                                                    ]}
                                                >
                                                    {selected && (
                                                        <Text style={styles.checkmark}>✓</Text>
                                                    )}
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                {/* Sport */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Sport</Text>

                                    {visibleSports.map((item) => {
                                        const selected = selectedSports.includes(item);

                                        return (
                                            <Pressable
                                                key={item}
                                                style={styles.row}
                                                onPress={() => toggleSport(item)}
                                            >
                                                <Text style={styles.label}>{item}</Text>

                                                <View
                                                    style={[
                                                        styles.checkbox,
                                                        selected && styles.checkboxSelected,
                                                    ]}
                                                >
                                                    {selected && (
                                                        <Text style={styles.checkmark}>✓</Text>
                                                    )}
                                                </View>
                                            </Pressable>
                                        );
                                    })}

                                    {sportOptions.length > 3 && (
                                        <Pressable
                                            style={styles.moreRow}
                                            onPress={() => setShowAllSports((prev) => !prev)}
                                        >
                                            <Text style={styles.moreText}>
                                                {showAllSports ? "Show less" : "More"}
                                            </Text>
                                            {/* <ArrowRightIcon/>
                                            <ArrowUpIcon/> */}
                                            <Text style={styles.arrow}>
                                                {showAllSports ? "⌃" : "›"}
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            </ScrollView>
                        </View>

                        <View style={styles.filterBottom}>
                            <Pressable>
                                <Text 
                                    style={{
                                        fontFamily: Font.bold, 
                                        color: Colors.primary
                                    }}
                                    onPress={handleResetFilter}
                                >
                                    Reset
                                </Text>
                            </Pressable>

                            <TouchableOpacity
                                style={{
                                    width: 127,
                                    height: 54,
                                    borderRadius: 24,
                                    backgroundColor: Colors.primary,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white"
                                    }}
                                >
                                    Apply filter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </AppModal>
        </View>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
    },
    map: {
        width: "100%",
        height: "100%",
    },
    eventMapContainer: {
        position: "absolute",
        right: 20,
        top: 370
    },
    floatingStyle:{
        position: "absolute",
        right: 20,
        bottom: 360,
        width: 140,
        height: 36,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 4
    },
    moreRow: {
        minHeight: 36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    moreText: {
        color: "#30303B",
        fontFamily: Font.bold
    },

    arrow: {
        fontSize: 30,
        color: "#BFC1D2",
    },
    section: {
        gap: 4,
    },
    sectionTitle: {
        fontFamily: Font.bold,
        marginBottom: 4,
        color: "#242433",
    },
    row: {
        minHeight: 36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 15,
        color: "#30303B",
    },
    divider: {
        height: 1,
        backgroundColor: "#E8E8EE",
        marginVertical: 12,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#BFC1D2",
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterSelected: {
        borderColor: "#4A0000",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#4A0000",
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#BFC1D2",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        borderColor: "#4A0000",
        backgroundColor: "#4A0000",
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
    filterBottom: {
        height: 109,
        backgroundColor: "white",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24
    },
    filter: {
        // justifyContent: "space-between",
        flex: 1
    },
    content: {
        flex: 1,
        paddingTop: 30
    },
    modalTop: {
        height: 44,
        width: "100%",
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
    modalContainer: {
        height: "100%",
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: Colors.appBg
    },
    search: {
        height: 54,
        width: "100%",
        justifyContent: "flex-start",
        alignContent: "center",
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 8,
        borderColor: "#EBEBF0",
        flexDirection: "row"
    },
    listContent: {
        gap: 12,
        paddingTop: 20,
        paddingBottom: 100,
    },
    plistContent: {
        paddingBottom: 100,
        alignItems: "center",
        paddingTop: 20
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 12
    },
    container: {
        display: "flex",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "flex-end",
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
