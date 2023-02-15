import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./HomePage";
import PostPage from "./PostPage";
import ChatsPage from "./ChatsPage";
import ProfilePage from "./ProfilePage";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Chats") {
            iconName = focused
              ? "chatbubble-ellipses-sharp"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#845EC2",
        tabBarInactiveTintColor: "#845EC2",
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Post" component={PostPage} />
      <Tab.Screen name="Chats" component={ChatsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
