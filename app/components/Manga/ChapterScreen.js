import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
	ScrollView,
	Image,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import ImageZoom from "react-native-image-pan-zoom";

const windowWidth = Dimensions.get("window").width;

const ChapterScreen = () => {
	const route = useRoute();
	const { chapter } = route.params;
	const chapterId = chapter.id;

	const [pages, setPages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [imageHeights, setImageHeights] = useState([]); // Store heights of images

	useEffect(() => {
		const fetchChapterPages = async () => {
			try {
				const response = await axios.get(
					`https://api.mangadex.org/at-home/server/${chapterId}`
				);

				const baseUrl = response.data.baseUrl;
				const chapterData = response.data.chapter;

				const imageUrls = chapterData.data.map((fileName) => ({
					url: `${baseUrl}/data/${chapterData.hash}/${fileName}`,
				}));

				setPages(imageUrls);
				setImageHeights(new Array(imageUrls.length).fill(0)); // Initialize heights array
			} catch (error) {
				console.error("Error fetching chapter pages:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchChapterPages();
	}, [chapterId]);

	// Function to get image size
	const getImageSize = (url, index) => {
		Image.getSize(
			url,
			(width, height) => {
				const aspectRatio = width / height;
				const newHeight = windowWidth / aspectRatio; // Maintain aspect ratio based on width
				setImageHeights((prevHeights) => {
					const newHeights = [...prevHeights];
					newHeights[index] = newHeight; // Set height for this image
					return newHeights;
				});
			},
			(error) => {
				console.error("Error getting image size:", error);
			}
		);
	};

	// After loading images, get their sizes
	useEffect(() => {
		if (pages.length) {
			pages.forEach((item, index) => {
				getImageSize(item.url, index);
			});
		}
	}, [pages]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#000" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{pages.map((item, index) => (
					<View
						style={[styles.pageContainer, { height: imageHeights[index] || 0 }]}
						key={index}
					>
						<ImageZoom
							cropWidth={windowWidth}
							cropHeight={imageHeights[index] || 0} // Set dynamic crop height
							imageWidth={windowWidth}
							imageHeight={imageHeights[index] || 0} // Set dynamic image height
							enableSwipeDown={false}
						>
							<Image
								source={{ uri: item.url }}
								style={styles.pageImage}
								resizeMode="contain" // Keep aspect ratio
							/>
						</ImageZoom>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1c1d22",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1c1d22",
	},
	pageContainer: {
		width: windowWidth,
		justifyContent: "center",
		alignItems: "center",
	},
	pageImage: {
		width: "100%", // Ensure the image fills the width of the screen
		height: "100%", // Set height to 100% to fill the height of the container
	},
});

export default ChapterScreen;
