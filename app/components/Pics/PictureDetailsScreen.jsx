import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext";

const PictureDetailScreen = ({ route }) => {
	const { image } = route.params;
	const { currentTheme } = useContext(ThemeContext);
	const [isSaved, setIsSaved] = useState(false);

	const saveImage = async () => {
		try {
			// Retrieve saved images from AsyncStorage
			const savedImagesData = await AsyncStorage.getItem("savedImages");
			const imagesArray = savedImagesData ? JSON.parse(savedImagesData) : [];

			// Check if the image object already exists in the saved images
			if (!imagesArray.some((savedImage) => savedImage.uri === image.uri)) {
				imagesArray.push(image); // Save the entire image object
				await AsyncStorage.setItem("savedImages", JSON.stringify(imagesArray));
				setIsSaved(true);
				Alert.alert("Success", "Image saved successfully!");
			} else {
				Alert.alert("Info", "Image is already saved.");
			}
		} catch (error) {
			console.error("Error saving image:", error);
			Alert.alert("Error", "Could not save image.");
		}
	};

	if (!image) {
		return (
			<View style={[styles.errorContainer, { backgroundColor: currentTheme.background }]}>
				<Text style={[styles.errorText, { color: currentTheme.text }]}>
					Image details not available.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}>
			<Image
				source={{ uri: image.uri }}
				style={[styles.image, { aspectRatio: image.dimensions.width / image.dimensions.height }]}
				resizeMode="contain"
			/>
			<View style={[styles.detailsContainer, { backgroundColor: currentTheme.cardBackground }]}>
				<Button title={isSaved ? "Saved" : "Save Image"} onPress={saveImage} disabled={isSaved} />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		alignItems: "center",
		padding: 16,
	},
	image: {
		width: "100%",
		borderRadius: 8,
		marginBottom: 16,
	},
	detailsContainer: {
		width: "100%",
		padding: 16,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	titleText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	text: {
		fontSize: 14,
		marginBottom: 4,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		fontSize: 16,
	},
});

export default PictureDetailScreen;
