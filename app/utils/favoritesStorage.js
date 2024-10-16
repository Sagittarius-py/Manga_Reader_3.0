import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "FAVORITES_MANGA_LIST";

export const getFavorites = async () => {
	try {
		const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
		return favorites ? JSON.parse(favorites) : [];
	} catch (error) {
		console.error("Error loading favorites:", error);
		return [];
	}
};

export const addFavorite = async (manga) => {
	try {
		const currentFavorites = await getFavorites();
		const updatedFavorites = [...currentFavorites, manga];
		await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
	} catch (error) {
		console.error("Error adding favorite:", error);
	}
};

export const removeFavorite = async (mangaId) => {
	try {
		const currentFavorites = await getFavorites();
		const updatedFavorites = currentFavorites.filter(
			(item) => item.id !== mangaId
		);
		await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
	} catch (error) {
		console.error("Error removing favorite:", error);
	}
};

export const isFavorite = async (mangaId) => {
	try {
		const currentFavorites = await getFavorites();
		return currentFavorites.some((item) => item.id === mangaId);
	} catch (error) {
		console.error("Error checking favorite:", error);
		return false;
	}
};
