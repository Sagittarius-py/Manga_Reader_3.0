import React, { useEffect, useState, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext";

const SavedImagesScreen = ({ navigation }) => {
	const { currentTheme } = useContext(ThemeContext);
	const [savedImages, setSavedImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: currentTheme.background,
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
			color: currentTheme.text,
		},
		noImagesText: {
			fontSize: 18,
			color: currentTheme.text,
			textAlign: "center",
			marginTop: 20,
		},
		image: {
			width: "100%",
			aspectRatio: 2 / 3, // Keep the aspect ratio consistent
			borderRadius: 8,
		},
		imageWrapper: {
			flex: 1,
			padding: 8,
		},
		list: {
			paddingHorizontal: 8,
		},
	});

	const fetchSavedImages = async () => {
		try {
			const savedImagesData = await AsyncStorage.getItem("savedImages");
			const imagesArray = savedImagesData ? JSON.parse(savedImagesData) : [];
			setSavedImages(imagesArray);
		} catch (error) {
			setError("Failed to load saved images.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSavedImages();
	}, []);

	if (loading) {
		return (
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.imageWrapper}
			onPress={() => navigation.navigate("PictureDetails", { image: item })}
		>
			<Image source={{ uri: item.uri }} style={styles.image} />
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			{savedImages.length === 0 ? (
				<Text style={styles.noImagesText}>No saved images found.</Text>
			) : (
				<FlatList
					style={styles.list}
					data={savedImages}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
					contentContainerStyle={{ paddingBottom: 16 }}
				/>
			)}
		</View>
	);
};

export default SavedImagesScreen;
