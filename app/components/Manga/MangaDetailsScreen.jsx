import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
	View,
	Text,
	Image,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
	getFavorites,
	addFavorite,
	removeFavorite,
	isFavorite,
} from "../../utils/favoritesStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext";

const MangaDetailsScreen = () => {
	const scrollRef = useRef();
	const { theme, colors, currentTheme, selectedLanguages } =
		useContext(ThemeContext);
	const navigation = useNavigation();
	const route = useRoute();
	const { manga } = route.params;

	const [chapterList, setChapterList] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFav, setIsFav] = useState(false);
	const [lastReadChapter, setLastReadChapter] = useState(null);
	const [readChapters, setReadChapters] = useState([]); // To store read chapters

	const styles = StyleSheet.create({
    	container: {
    		backgroundColor: currentTheme.background,
    		paddingHorizontal: 16,
    		paddingTop: 16,
    	},
    	coverImage: {
    		width: "100%",
    		height: 600,
    		borderRadius: 10,
    		marginBottom: 16,
    	},
    	detailsContainer: {
    		paddingHorizontal: 16,
    	},
    	title: {
    		fontSize: 28,
    		fontWeight: "bold",
    		marginVertical: 10,
    		color: currentTheme.text,
    	},
    	description: {
    		fontSize: 16,
    		lineHeight: 24,
    		color: currentTheme.text,
    		marginBottom: 8,
    	},
    	year: {
    		fontSize: 14,
    		color: currentTheme.text2,
    		marginBottom: 4,
    	},
    	status: {
    		fontSize: 14,
    		color: currentTheme.text2,
    		marginBottom: 16,
    	},
    	chaptersTitle: {
    		fontSize: 22,
    		fontWeight: "600",
    		color: currentTheme.text,
    		marginBottom: 10,
    	},
    	chapterItem: {
    		backgroundColor: currentTheme.bars,
    		padding: 12,
    		marginVertical: 6,
    		borderRadius: 10,
    		shadowColor: "#000",
    		shadowOffset: { width: 0, height: 2 },
    		shadowOpacity: 0.3,
    		shadowRadius: 5,
    		elevation: 4,
    	},
    	chapterTitle: {
    		color: currentTheme.text,
    		fontSize: 16,
    		fontWeight: "600",
    	},
    	chapterTitleRead: {
    		color: currentTheme.text2,
    		fontSize: 14,
    		fontStyle: "italic",
    	},
    	chapterDate: {
    		fontSize: 12,
    		color: currentTheme.text2,
    		marginTop: 4,
    	},
    	favoriteButton: {
    		padding: 12,
    		backgroundColor: colors.accent,
    		alignItems: "center",
    		borderRadius: 5,
    		marginBottom: 16,
    	},
    	favoriteButtonText: {
    		color: "#fff",
    		fontSize: 16,
    		fontWeight: "600",
    	},
    	navGroup: {
    		marginTop: 20,
    		flexDirection: "row",
    		justifyContent: "space-between",
    		alignItems: "center",
    		paddingHorizontal: 16,
    	},
    	navButton: {
    		height: 40,
    		backgroundColor: colors.accent,
    		paddingHorizontal: 16,
    		borderRadius: 5,
    		justifyContent: "center",
    		alignItems: "center",
    	},
    	navButtonText: {
    		fontSize: 16,
    		color: "#fff",
    		fontWeight: "600",
    	},
    	navPage: {
    		fontSize: 18,
    		color: currentTheme.text,
    	},
    	lastReadContainer: {
    		marginVertical: 16,
    		alignItems: "center",
    		backgroundColor: currentTheme.bars,
    		padding: 16,
    		borderRadius: 10,
    		shadowColor: "#000",
    		shadowOffset: { width: 0, height: 2 },
    		shadowOpacity: 0.3,
    		shadowRadius: 5,
    		elevation: 4,
    	},
    	lastReadText: {
    		fontSize: 16,
    		color: currentTheme.text,
    		marginBottom: 8,
    	},
    	continueButton: {
    		padding: 12,
    		backgroundColor: colors.accent,
    		borderRadius: 5,
    	},
    	continueButtonText: {
    		color: "#fff",
    		fontSize: 16,
    		fontWeight: "600",
    	},
    });

	const scrollToTop = () => {
		scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
	};

	const loadLessChapters = () => {
		setPage((prevPage) => prevPage - 1);
	};

	const loadMoreChapters = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const fetchMangaData = async () => {
		try {
			const response = await axios.get(
				`https://api.mangadex.org/manga/${manga.id}/feed?order[chapter]=desc`,
				{
					params: {
						translatedLanguage: selectedLanguages, // Ensure this is correct
						limit: 40, // Check if this is valid for your request
						offset: (page - 1) * 40, // Ensure this makes sense for pagination
					},
				}
			);
			const filteredChapters = response.data.data.filter(
				(chapter) => chapter.attributes.pages >= 0
			);

			setChapterList(filteredChapters);

			// If fewer than 40 chapters are returned, disable further loading
			if (filteredChapters.length < 40) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		} catch (error) {
			console.error(
				"Error fetching manga data:",
				error.response?.data || error
			);
			Alert.alert("Error", "Failed to load manga data. Please try again.");
		}
	};

	useEffect(() => {
		fetchMangaData();
		checkIfFavorite();
		loadLastReadChapter(); // Load last read chapter on component mount
		loadReadChapters(); // Load read chapters on component mount
	}, [page]);

	const checkIfFavorite = async () => {
		const favorite = await isFavorite(manga.id);
		setIsFav(favorite);
	};

	const toggleFavorite = async () => {
		if (isFav) {
			await removeFavorite(manga.id);
			Alert.alert("Removed from Favorites");
		} else {
			await addFavorite(manga);
			Alert.alert("Added to Favorites");
		}
		setIsFav(!isFav);
	};

	const coverArt = manga.relationships.find((r) => r.type === "cover_art");
	const coverArtUri = coverArt
		? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
		: "https://via.placeholder.com/100x150?text=No+Image";

	// Save the last-read chapter to AsyncStorage
	const saveLastReadChapter = async (chapter) => {
		try {
			await AsyncStorage.setItem(
				`lastReadChapter_${manga.id}`,
				JSON.stringify(chapter)
			);
			setLastReadChapter(chapter); // Update state
			await markChapterAsRead(chapter.id); // Mark this chapter as read
		} catch (error) {
			console.error("Error saving last read chapter:", error);
		}
	};

	// Load the last-read chapter from AsyncStorage
	const loadLastReadChapter = async () => {
		try {
			const storedChapter = await AsyncStorage.getItem(
				`lastReadChapter_${manga.id}`
			);
			if (storedChapter) {
				setLastReadChapter(JSON.parse(storedChapter));
			}
		} catch (error) {
			console.error("Error loading last read chapter:", error);
		}
	};

	// Load the read chapters from AsyncStorage
	const loadReadChapters = async () => {
		try {
			const storedReadChapters = await AsyncStorage.getItem(
				`readChapters_${manga.id}`
			);
			if (storedReadChapters) {
				setReadChapters(JSON.parse(storedReadChapters));
			}
		} catch (error) {
			console.error("Error loading read chapters:", error);
		}
	};

	// Mark a chapter as read by adding it to the readChapters array and saving to AsyncStorage
	const markChapterAsRead = async (chapterId) => {
		try {
			const updatedReadChapters = [...readChapters, chapterId];
			setReadChapters(updatedReadChapters);
			await AsyncStorage.setItem(
				`readChapters_${manga.id}`,
				JSON.stringify(updatedReadChapters)
			);
		} catch (error) {
			console.error("Error marking chapter as read:", error);
		}
	};

	// Check if a chapter is already read
	const isChapterRead = (chapterId) => {
		return readChapters.includes(chapterId);
	};

	const renderItem = ({ item }) => {
		if (item.attributes.pages > 0) {
			return (
				<TouchableOpacity
					style={styles.chapterItem}
					onPress={() => {
						saveLastReadChapter(item);
						navigation.navigate("ChapterScreen", { chapter: item });
					}}
				>
					<Text
						style={
							isChapterRead(item.id)
								? styles.chapterTitleRead
								: styles.chapterTitle
						}
					>
						Chapter {item.attributes.chapter} {item.attributes.title || ""}
					</Text>
					<Text style={styles.chapterDate}>
						Published: {new Date(item.attributes.publishAt).toDateString()}
					</Text>
					<Text style={styles.year}>Pages: {item.attributes.pages}</Text>
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	};

	const ListHeaderComponent = () => (
    	<View style={styles.detailsContainer}>
    		<Image source={{ uri: coverArtUri }} style={styles.coverImage} />
    		<Text style={styles.title}>{manga.attributes.title.en}</Text>
    		<Text style={styles.description}>{manga.attributes.description.en}</Text>

    		<Text style={styles.year}>Year: {manga.attributes.year}</Text>
    		<Text style={styles.status}>
    			Status:{" "}
    			{manga.attributes.status.charAt(0).toUpperCase() +
    				manga.attributes.status.slice(1)}
    		</Text>
    		<TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
    			<Text style={styles.favoriteButtonText}>
    				{isFav ? "Remove from Favorites" : "Add to Favorites"}
    			</Text>
    		</TouchableOpacity>
    		<Text style={styles.chaptersTitle}>Chapters:</Text>

    		{/* Display last read chapter with a "Continue" button */}
    		{lastReadChapter && (
    			<View style={styles.lastReadContainer}>
    				<Text style={styles.lastReadText}>
    					Last Read: Chapter {lastReadChapter.attributes.chapter}{" "}
    					{lastReadChapter.attributes.title || ""}
    				</Text>
    				<TouchableOpacity
    					style={styles.continueButton}
    					onPress={() => {
    						navigation.navigate("ChapterScreen", {
    							chapter: lastReadChapter,
    						});
    					}}
    				>
    					<Text style={styles.continueButtonText}>Continue Reading</Text>
    				</TouchableOpacity>
    			</View>
    		)}
    	</View>
    );

	const renderFooter = () => (
		<View style={styles.navGroup}>
			<TouchableOpacity
				style={styles.navButton}
				onPress={() => {
					loadLessChapters();
					scrollToTop();
				}}
				disabled={page <= 1}
			>
				<Text style={styles.navButtonText}>Prev Page</Text>
			</TouchableOpacity>
			<Text style={styles.navPage}>{page}</Text>
			<TouchableOpacity
				style={styles.navButton}
				onPress={() => {
					loadMoreChapters();
					scrollToTop();
				}}
				disabled={!hasMore}
			>
				<Text style={styles.navButtonText}>Next Page</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<FlatList
			ref={scrollRef}
			data={chapterList}
			ListHeaderComponent={ListHeaderComponent}
			ListFooterComponent={renderFooter}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.container}
			onEndReachedThreshold={0.1}
		/>
	);
};

export default MangaDetailsScreen;
