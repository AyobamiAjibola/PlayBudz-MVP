import AppTabs from "@/components/app-tabs";
// import { Tabs } from "expo-router";

export default function ScreensLayout() {
//   return (
//     <Tabs screenOptions={{ headerShown: false }}>
//       <Tabs.Screen name="home" />
//       <Tabs.Screen name="search" />
//       <Tabs.Screen name="chat" />
//       <Tabs.Screen name="profile" />
//     </Tabs>
//   );
    return <AppTabs/>;
}