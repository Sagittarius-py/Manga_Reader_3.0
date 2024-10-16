import React, { useContext } from "react";
import "react-native-gesture-handler";
import { ThemeProvider } from "./context/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import { StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "./context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusBar } from "react-native";

// Importing screen components
import MangaListScreen from "./components/Manga/MangaListScreen";
import MangaDetailsScreen from "./components/Manga/MangaDetailsScreen";
import SettingsScreen from "./components/SettingsScreen";
import ChapterScreen from "./components/Manga/ChapterScreen";
import FavoritesScreen from "./components/Manga/FavoritesScreen";
import ExploreScreen from "./components/Manga/ExploreScreen";
import PicturesScreen from "./components/Pics/PicturesScreen";
import PictureDetailsScreen from "./components/Pics/PictureDetailsScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";

// Create stack and drawer navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Custom drawer content component with Manga and Pictures sections
const CustomDrawerContent = (props) => {
	const { currentTheme, colors } = useContext(ThemeContext);
	const currentRoute = props.state.routeNames[props.state.index]; // Get the current route name

	const isFocused = (routeName) => currentRoute === routeName; // Function to check if a route is focused

	return (
		<DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
			{/* Manga Section */}
			<Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
				Manga
			</Text>
			<View style={{ flex: 1 }}>
				<DrawerItem
					label="Home"
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("Home") ? "home" : "home-outline"}
							size={size}
							color={isFocused("Home") ? colors.accent : currentTheme.text2}
						/>
					)}
					style={
						isFocused("Home") ? { backgroundColor: colors.accent + "20" } : null
					} // Background when focused
					onPress={() => props.navigation.navigate("Home")}
				/>
				<DrawerItem
					label="Explore"
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("Explore") ? "compass" : "compass-outline"}
							size={size}
							color={isFocused("Explore") ? colors.accent : currentTheme.text2}
						/>
					)}
					style={
						isFocused("Explore")
							? { backgroundColor: colors.accent + "20" }
							: null
					} // Background when focused
					onPress={() => props.navigation.navigate("Explore")}
				/>
				<DrawerItem
					label="Favorites"
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("Favs") ? "heart" : "heart-outline"}
							size={size}
							color={isFocused("Favs") ? colors.accent : currentTheme.text2}
						/>
					)}
					style={
						isFocused("Favs") ? { backgroundColor: colors.accent + "20" } : null
					} // Background when focused
					onPress={() => props.navigation.navigate("Favs")}
				/>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Pictures Section */}
			<Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
				Pictures
			</Text>
			<View style={{ flex: 1 }}>
				<DrawerItem
					label="Gallery"
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("Pictures") ? "images" : "images-outline"}
							size={size}
							color={isFocused("Pictures") ? colors.accent : currentTheme.text2}
						/>
					)}
					style={
						isFocused("Pictures")
							? { backgroundColor: colors.accent + "20" }
							: null
					} // Background when focused
					onPress={() => props.navigation.navigate("Pictures")}
				/>

				<DrawerItem
					label="Picture Details"
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("PictureDetails") ? "image" : "image-outline"}
							size={size}
							color={
								isFocused("PictureDetails") ? colors.accent : currentTheme.text2
							}
						/>
					)}
					style={
						isFocused("PictureDetails")
							? { backgroundColor: colors.accent + "20" }
							: null
					} // Background when focused
					onPress={() => props.navigation.navigate("PictureDetails")}
				/>
			</View>

			{/* Bottom part for Settings */}
			<View style={{ borderTopWidth: 1, borderTopColor: currentTheme.text }}>
				<DrawerItem
					label=""
					labelStyle={{ color: currentTheme.text }}
					icon={({ size }) => (
						<Icon
							name={isFocused("Settings") ? "settings" : "settings-outline"}
							size={size}
							color={isFocused("Settings") ? colors.accent : currentTheme.text}
						/>
					)}
					style={
						isFocused("Settings")
							? { backgroundColor: colors.accent + "20" }
							: null
					} // Background when focused
					onPress={() => props.navigation.navigate("Settings")}
				/>
			</View>
		</DrawerContentScrollView>
	);
};
const DrawerNavigator = () => {
	const { currentTheme, colors } = useContext(ThemeContext);
	const styles = StyleSheet.create({
		drawerStyle: {
			backgroundColor: currentTheme.bars,
		},
	});
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				drawerStyle: styles.drawerStyle,
				drawerActiveTintColor: colors.accent,
				headerShown: false,
			}}
		>
			<Drawer.Screen name="MainStack" component={StackNavigator} />
		</Drawer.Navigator>
	);
};

const StackNavigator = () => {
	const { currentTheme, colors } = useContext(ThemeContext);
	return (
		<Stack.Navigator
			screenOptions={({ navigation }) => ({
				headerLeft: () => (
					<Icon
						name="menu"
						size={25}
						color={colors.accent}
						style={{ marginLeft: 10 }}
						onPress={() => navigation.toggleDrawer()} // Toggle the drawer
					/>
				),
				headerStyle: {
					backgroundColor: currentTheme.background,
				},
				headerTintColor: currentTheme.text,
			})}
		>
			<Stack.Screen
				name="Home"
				options={{
					title: "My home",
					headerStyle: {
						backgroundColor: currentTheme.cardBackground,
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
				component={MangaListScreen}
			/>
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="MangaDetails" component={MangaDetailsScreen} />
			<Stack.Screen name="ChapterScreen" component={ChapterScreen} />
			<Stack.Screen name="Favs" component={FavoritesScreen} />
			<Stack.Screen name="Explore" component={ExploreScreen} />
			<Stack.Screen name="Pictures" component={PicturesScreen} />
			<Stack.Screen name="PictureDetails" component={PictureDetailsScreen} />
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginLeft: 16,
		marginVertical: 10,
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(255,255,255,0.3)",
		marginVertical: 10,
	},
});

const App = () => (
	<>
		<StatusBar hidden />
		<ThemeProvider>
			<NavigationContainer independent={true}>
				<DrawerNavigator />
			</NavigationContainer>
		</ThemeProvider>
	</>
);

export default App;
