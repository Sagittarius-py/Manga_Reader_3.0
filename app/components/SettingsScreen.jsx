import React, { useContext } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../context/ThemeContext"; // Import your ThemeContext

const SettingsScreen = () => {
	const {
		theme,
		toggleTheme,
		colors,
		updateColors,
		currentTheme,
		adultContentEnabled,
		toggleAdultContent,
		selectedLanguages,
		toggleLanguageSelection,
		availableLanguages, // Access available languages from context
	} = useContext(ThemeContext);

	const accentColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8"]; // Define some accent colors

	const handleAccentColorChange = (color) => {
		updateColors({ ...colors, accent: color });
	};

	return (
		<View
			style={[styles.container, { backgroundColor: currentTheme.background }]}
		>
			{/* Dark Mode Section */}
			<View style={styles.section2}>
				<Text style={[styles.text, { color: currentTheme.text }]}>
					Dark Mode
				</Text>
				<Switch
					value={theme === "dark"}
					onValueChange={() => toggleTheme(theme === "dark" ? "light" : "dark")}
				/>
			</View>

			{/* Accent Color Section */}
			<View style={styles.section}>
				<Text style={[styles.text, { color: currentTheme.text }]}>
					Accent Color
				</Text>
				<View style={styles.colorPicker}>
					{accentColors.map((color) => (
						<TouchableOpacity
							key={color}
							style={[styles.colorButton, { backgroundColor: color }]}
							onPress={() => handleAccentColorChange(color)}
						/>
					))}
				</View>
			</View>

			{/* Language Selection Section */}
			<View style={styles.section}>
				<Text style={[styles.text, { color: currentTheme.text }]}>
					Select Languages
				</Text>
				<View style={styles.languagePicker}>
					{availableLanguages.map((lang) => (
						<TouchableOpacity
							key={lang}
							style={[
								styles.languageButton,
								{
									backgroundColor: selectedLanguages.includes(lang)
										? colors.accent
										: currentTheme.cardBackground,
								},
							]}
							onPress={() => toggleLanguageSelection(lang)}
						>
							<Text style={{ color: currentTheme.text }}>
								{lang.toUpperCase()}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Adult Content Filter Section */}
			<View style={styles.section2}>
				<Text style={[styles.text, { color: currentTheme.text }]}>
					Show Adult Content
				</Text>
				<Switch
					value={adultContentEnabled}
					onValueChange={toggleAdultContent}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	section: {
		marginVertical: 16,
	},
	section2: {
		marginVertical: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	text: {
		fontSize: 18,
	},
	colorPicker: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	colorButton: {
		width: 50,
		height: 50,
		borderRadius: 4,
		marginHorizontal: 8,
	},
	languagePicker: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	languageButton: {
		width: 70,
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 8,
		margin: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default SettingsScreen;
