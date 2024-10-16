import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const themes = {
	light: {
		background: "#ffffff",
		bars: "#e0e0e0",
		text: "#18181b",
		text2: "#282828",
		header: "#e0e0e0",
		cardBackground: "#f0f0f0",
	},
	dark: {
		background: "#27272A",
		bars: "#18181b",
		text: "#e0e0e0",
		text2: "#777777",
		header: "#2d2d2d",
		cardBackground: "#18181b",
	},
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");
	const [colors, setColors] = useState({
		header: "#f8f8f8",
		accent: "#FF5733", // Default accent color
	});
	const [adultContentEnabled, setAdultContentEnabled] = useState(false);
	const [selectedLanguages, setSelectedLanguages] = useState(["en"]); // Store selected languages
	const availableLanguages = [
		"en",
		"pl",
		"ja",
		"de",
		"es",
		"zh",
		"ko",
		"fr",
		"pt-br",
		"it",
		"es-la",
		"ru",
	]; // Available languages

	useEffect(() => {
		const loadSettings = async () => {
			try {
				const storedTheme = await AsyncStorage.getItem("theme");
				const storedColors = await AsyncStorage.getItem("colors");
				const storedAdultContent = await AsyncStorage.getItem(
					"adultContentEnabled"
				);
				const storedLanguages = await AsyncStorage.getItem("selectedLanguages");

				if (storedTheme) setTheme(storedTheme);
				if (storedColors) setColors(JSON.parse(storedColors));
				if (storedAdultContent !== null)
					setAdultContentEnabled(JSON.parse(storedAdultContent));
				if (storedLanguages) setSelectedLanguages(JSON.parse(storedLanguages));
			} catch (error) {
				console.error("Failed to load settings:", error);
			}
		};

		loadSettings();
	}, []);

	const saveSettings = async (newTheme, newColors, adultContent, languages) => {
		try {
			await AsyncStorage.setItem("theme", newTheme);
			await AsyncStorage.setItem("colors", JSON.stringify(newColors));
			await AsyncStorage.setItem(
				"adultContentEnabled",
				JSON.stringify(adultContent)
			);
			await AsyncStorage.setItem(
				"selectedLanguages",
				JSON.stringify(languages)
			);
		} catch (error) {
			console.error("Failed to save settings:", error);
		}
	};

	const toggleTheme = (newTheme) => {
		setTheme(newTheme);
		saveSettings(newTheme, colors, adultContentEnabled, selectedLanguages);
	};

	const updateColors = (newColors) => {
		setColors(newColors);
		saveSettings(theme, newColors, adultContentEnabled, selectedLanguages);
	};

	const toggleAdultContent = () => {
		const newAdultContentEnabled = !adultContentEnabled;
		setAdultContentEnabled(newAdultContentEnabled);
		saveSettings(theme, colors, newAdultContentEnabled, selectedLanguages);
	};

	const toggleLanguageSelection = (lang) => {
		const newLanguages = selectedLanguages.includes(lang)
			? selectedLanguages.filter((l) => l !== lang)
			: [...selectedLanguages, lang];
		setSelectedLanguages(newLanguages);
		saveSettings(theme, colors, adultContentEnabled, newLanguages);
	};

	const value = {
		theme,
		colors,
		toggleTheme,
		updateColors,
		currentTheme: themes[theme],
		adultContentEnabled,
		toggleAdultContent,
		selectedLanguages,
		toggleLanguageSelection,
		availableLanguages, // Pass the available languages
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};
