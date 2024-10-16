import React, { useState, useEffect, useContext } from "react";
import {
	View,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	Animated,
	ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../context/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const MangaListScreen = () => {
	const { colors, currentTheme } = useContext(ThemeContext);
	const [mangaListPopular, setMangaListPopular] = useState([]);
	const [mangaListNew, setMangaListNew] = useState([]);
	const [mangaListNewChapter, setMangaListNewChapter] = useState([]);
	const navigation = useNavigation();
	const scrollX = new Animated.Value(0);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: currentTheme.background,
			paddingTop: 20,
		},
		itemContainer: {
			height: 250,
			width: 150,
			flexDirection: "column",
			alignItems: "center",
			marginRight: 10,
			borderRadius: 8,
			backgroundColor: currentTheme.cardBackground,
		},
		itemContainer2: {
			height: 150,
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 10,
			borderRadius: 8,
			backgroundColor: currentTheme.cardBackground,
			paddingRight: 10,
		},
		coverImage: {
			width: 150,
			height: 200,
			borderTopLeftRadius: 8,
			borderTopRightRadius: 8,
		},
		coverImage2: {
			width: 100,
			height: 150,
			borderTopLeftRadius: 8,
			borderBottomLeftRadius: 8,
		},
		textContainer: {
			flex: 1,
			marginLeft: 10,
			justifyContent: "center",
		},
		title: {
			width: 150,
			fontSize: 16,
			color: currentTheme.text,
		},
		title2: {
			width: 300,
			fontSize: 16,
			color: currentTheme.text,
		},
		redirect: {
			fontSize: 18,
			fontWeight: "bold",
			color: colors.accent,
			marginLeft: 20,
		},
		icon: {
			color: colors.accent,
		},
		cont: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 10,
			marginBottom: 10,
		},
		divider: {
			borderBottomColor: colors.accent,
			borderBottomWidth: 1,
			width: "100%",
			marginVertical: 10,
		},
	});

	const fetchMangaData = async ({ endpoint, setter, params }) => {
		try {
			const response = await axios.get(endpoint, { params });
			setter(response.data.data);
		} catch (error) {
			console.error("Error fetching manga data:", error);
		}
	};

	useEffect(() => {
		// Fetch most popular manga based on rating
		fetchMangaData({
			endpoint: "https://api.mangadex.org/manga?order[followedCount]=desc",
			setter: setMangaListPopular,
			params: {
				limit: 10,
				includes: ["cover_art"],
			},
		});

		// Fetch most followed manga (correct the order parameter)
		fetchMangaData({
			endpoint: "https://api.mangadex.org/manga?order[rating]=desc",
			setter: setMangaListNew,
			params: {
				limit: 10,
				includes: ["cover_art"],
			},
		});

		// Fetch manga with the latest chapter uploads
		fetchMangaData({
			endpoint:
				"https://api.mangadex.org/manga?order[latestUploadedChapter]=desc",
			setter: setMangaListNewChapter,
			params: {
				limit: 10,
				includes: ["cover_art"],
			},
		});
	}, []);

	const renderItemHorizontal = ({ item }) => {
		const coverArt = item.relationships.find((r) => r.type === "cover_art");
		const coverArtUri = coverArt
			? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}`
			: "https://via.placeholder.com/150x200?text=No+Image";

		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("MangaDetails", { manga: item })}
				style={styles.itemContainer}
			>
				<Image source={{ uri: coverArtUri }} style={styles.coverImage} />
				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.title}>
						{item.attributes.title.en}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const renderItemVertical = ({ item }) => {
		const coverArt = item.relationships.find((r) => r.type === "cover_art");
		const coverArtUri = coverArt
			? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}`
			: "https://via.placeholder.com/150x200?text=No+Image";

		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("MangaDetails", { manga: item })}
				style={styles.itemContainer2}
			>
				<Image source={{ uri: coverArtUri }} style={styles.coverImage2} />
				<View style={styles.textContainer}>
					<Text style={styles.title2}>{item.attributes.title.en}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.cont}>
				<Text numberOfLines={1} style={styles.redirect}>
					Most Popular
				</Text>
			</View>

			<FlatList
				data={mangaListPopular}
				renderItem={renderItemHorizontal}
				keyExtractor={(item) => item.id}
				horizontal
				showsHorizontalScrollIndicator={true}
				contentContainerStyle={{ paddingHorizontal: 10 }}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{
						useNativeDriver: false,
					}
				)}
			/>
			<View style={styles.divider} />

			<View style={styles.cont}>
				<Text numberOfLines={1} style={styles.redirect}>
					New Releases
				</Text>
			</View>
			<View style={styles.secc2}>
				<FlatList
					data={mangaListNew}
					horizontal
					renderItem={renderItemHorizontal}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingHorizontal: 10 }}
				/>
			</View>
			<View style={styles.divider} />

			<View style={styles.cont}>
				<Text numberOfLines={1} style={styles.redirect}>
					New Chapter Uploaded
				</Text>
			</View>
			<View style={styles.secc2}>
				<FlatList
					data={mangaListNewChapter}
					horizontal
					renderItem={renderItemHorizontal}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingHorizontal: 10 }}
				/>
			</View>

			<View style={styles.divider} />
		</ScrollView>
	);
};

export default MangaListScreen;
