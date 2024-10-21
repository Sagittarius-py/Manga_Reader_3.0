import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFavorites } from "../../utils/favoritesStorage";
import { ThemeContext } from "../../context/ThemeContext";

const FavoritesScreen = () => {
	const { colors, currentTheme } = useContext(ThemeContext);
	const [favorites, setFavorites] = useState([]);
	const navigation = useNavigation();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: currentTheme.background,
			padding: 10,
		},
		header: {
			fontSize: 24,
			fontWeight: "bold",
			marginBottom: 20,
			color: currentTheme.text,
		},
		emptyText: {
			fontSize: 18,
			color: "#666",
			textAlign: "center",
			marginTop: 50,
		},
		listContainer: {
			paddingBottom: 20,
		},
		mangaItem: {
			flexDirection: "row",
			marginBottom: 15,
			backgroundColor: currentTheme.cardBackground,
			borderRadius: 5,
			overflowX: "hidden",
		},
		coverImage: {
			width: 100,
			height: 150,
		},
		detailsContainer: {
			flex: 1,
			padding: 10,
		},
		title: {
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 5,
			color: currentTheme.text,
		},
		description: {
			fontSize: 14,
			color: currentTheme.text2,
		},
	});

	useEffect(() => {
		const loadFavorites = async () => {
			const savedFavorites = await getFavorites();
			setFavorites(savedFavorites);
		};

		const unsubscribe = navigation.addListener("focus", loadFavorites); // Load favorites every time the screen is focused
		return unsubscribe;
	}, [navigation]);

	const renderItem = ({ item }) => {
		const coverArt = item.relationships.find((r) => r.type === "cover_art");
		const coverArtUri = coverArt
			? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}`
			: "https://via.placeholder.com/100x150?text=No+Image";

		return (
			<TouchableOpacity
				style={styles.mangaItem}
				onPress={() => navigation.navigate("MangaDetails", { manga: item })}
			>
				<Image source={{ uri: coverArtUri }} style={styles.coverImage} />
				<View style={styles.detailsContainer}>
					<Text style={styles.title}>{item.attributes.title.en}</Text>
					<Text style={styles.description} numberOfLines={3}>
						{item.attributes.description.en}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Your Favorites</Text>
			{favorites.length === 0 ? (
				<Text style={styles.emptyText}>No favorites added yet.</Text>
			) : (
				<FlatList
					data={favorites}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContainer}
				/>
			)}
		</View>
	);
};

export default FavoritesScreen;
