import React, { useContext } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

const MangaFragment = ({ item, navigation }) => { // Add navigation as a prop
	const { currentTheme } = useContext(ThemeContext);

	const styles = StyleSheet.create({
		itemContainer: {
			flexDirection: "column",
			margin: 5,
			backgroundColor: currentTheme.cardBackground,
			borderRadius: 8,
			overflow: "hidden", // Change overflowX to overflow
            width: 120,
			height: 200,
		},
		coverImage: {
			height: 150,
			borderTopRightRadius: 8,
			borderTopLeftRadius: 8,
		},
		textContainer: {
			padding: 10,
			justifyContent: "center",
			alignItems: "center",
		},
		title: {
			fontSize: 14,
			color: currentTheme.text,
			textAlign: "center",
		},
	});

	// Fetch cover image URL
	const coverArt = item.relationships.find((rel) => rel.type === "cover_art");
	const coverArtUri = coverArt
		? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}`
		: null;

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("MangaDetails", { manga: item })}
			style={styles.itemContainer}
		>
			{coverArtUri && (
				<Image source={{ uri: coverArtUri }} style={styles.coverImage} />
			)}
			<View style={styles.textContainer}>
				<Text numberOfLines={1} style={styles.title}>
					{item.attributes.title.en || item.attributes.title["ja-ro"]}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default MangaFragment;
