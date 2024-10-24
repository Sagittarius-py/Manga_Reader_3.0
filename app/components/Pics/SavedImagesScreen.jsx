import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
	TouchableOpacity,
		FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext";
import MasonryList from "react-native-masonry-list";

const SavedImagesScreen = ({ navigation }) => {
	const { currentTheme } = useContext(ThemeContext);
	const [savedImages, setSavedImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const styles = StyleSheet.create({
		container: {
			flexGrow: 1,
			padding: 16,
			flexDirection: "row",
		},
		loaderContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		errorContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		errorText: {
			fontSize: 16,
		},
		noImagesText: {
			fontSize: 18,
			textAlign: "center",
		},
		image: {
			width: 100,
			height: 300,
			borderRadius: 8,
			marginBottom: 8,
		},
		list: {
			backgroundColor: currentTheme.background, // Set background based on theme
		},
	});

	const fetchSavedImages = async () => {
		try {
			const savedImagesData = await AsyncStorage.getItem("savedImages");
			const imagesArray = savedImagesData ? JSON.parse(savedImagesData) : [];
			console.log("Fetched images from AsyncStorage:", imagesArray); // Log the fetched data
			setSavedImages(imagesArray);
		} catch (error) {
			setError("Failed to load saved images.");
			console.error("Error fetching saved images:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSavedImages();
	}, []);

	if (loading) {
		return (
			<View style={[styles.loaderContainer, { backgroundColor: currentTheme.background }]}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={[styles.errorContainer, { backgroundColor: currentTheme.background }]}>
				<Text style={[styles.errorText, { color: currentTheme.text }]}>{error}</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => {
		console.log("Rendering item:", item); // Log the item being rendered
		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("PictureDetails", { image: item })}
			>
				<Image source={{ uri: item }} style={styles.image} />
			</TouchableOpacity>
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: currentTheme.background }]}>
			{savedImages.length === 0 ? (
				<Text style={[styles.noImagesText, { color: currentTheme.text }]}>No saved images found.</Text>
			) : (
				<FlatList
					style={styles.list}
					data={savedImages}
					renderItem={renderItem} // Pass renderItem directly
				/>
			)}
		</View>
	);
};

export default SavedImagesScreen;
