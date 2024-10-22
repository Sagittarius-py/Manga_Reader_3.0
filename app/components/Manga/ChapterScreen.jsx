import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    PanResponder,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import ImageZoom from "react-native-image-pan-zoom";

const windowWidth = Dimensions.get("window").width;
const scrollAreaWidth = 100; // Width of the transparent scroll area

// Helper function to limit concurrent image size requests
async function getSizes(url) {
    return new Promise((resolve, reject) => {
        Image.getSize(
            url,
            (width, height) => resolve({ width, height }),
            (error) => reject(error)
        );
    });
}

const ChapterScreen = () => {
    const route = useRoute();
    const { chapter } = route.params;
    const chapterId = chapter.id;

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null); // Reference to FlatList

    useEffect(() => {
        const fetchChapterPages = async () => {
            try {
                const response = await axios.get(
                    `https://api.mangadex.org/at-home/server/${chapterId}`
                );

                const baseUrl = response.data.baseUrl;
                const chapterData = response.data.chapter;

                // Limit the number of concurrent requests
                const limitConcurrentRequests = async (urls, limit = 5) => {
                    const results = [];
                    for (let i = 0; i < urls.length; i += limit) {
                        const batch = urls.slice(i, i + limit).map(async (fileName) => {
                            const url = `${baseUrl}/data/${chapterData.hash}/${fileName}`;
                            try {
                                const size = await getSizes(url);
                                return { url, width: size.width, height: size.height };
                            } catch {
                                return { url, width: windowWidth, height: windowWidth };
                            }
                        });
                        results.push(...(await Promise.all(batch)));
                    }
                    return results;
                };

                const imageUrls = await limitConcurrentRequests(chapterData.data);
                setPages(imageUrls);
            } catch (error) {
                console.error("Error fetching chapter pages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterPages();
    }, [chapterId]);

    const renderItem = useCallback(
        ({ item }) => {
            if (!item.width || !item.height || item.height === 0) {
                console.error("Invalid image dimensions:", item.width, item.height);
                return null;
            }

            const aspectRatio = item.width / item.height;
            const calculatedHeight = windowWidth / aspectRatio;

            return (
                <View style={styles.pageContainer}>
                    <ImageZoom
                        cropWidth={windowWidth}
                        cropHeight={calculatedHeight}
                        imageWidth={windowWidth}
                        imageHeight={calculatedHeight}
                    >
                        <Image
                            source={{ uri: item.url }}
                            style={{ width: windowWidth, height: calculatedHeight }}
                            resizeMethod="scale"
                            resizeMode="contain"
                        />
                    </ImageZoom>
                    <View style={styles.scrollArea} />
                </View>
            );
        },
        [windowWidth]
    );

    const keyExtractor = useCallback((item, index) => index.toString(), []);

    // PanResponder to handle scroll gestures
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const { moveY } = gestureState;
                if (flatListRef.current) {
                    // Calculate the index to scroll to based on the touch position
                    const totalHeight = pages.reduce((sum, item) => {
                        const aspectRatio = item.width / item.height;
                        const calculatedHeight = windowWidth / aspectRatio;
                        return sum + calculatedHeight;
                    }, 0);

                    const position = (moveY / Dimensions.get('window').height) * totalHeight;
                    flatListRef.current.scrollToOffset({ offset: position, animated: false });
                }
            },
        })
    ).current;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={pages}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={7}
                removeClippedSubviews={true}
                bounces={false} // Disable bouncing effect
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1c1d22",
        flex: 1,
        position: 'relative', // Relative position for child elements
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c1d22",
    },
    scrollArea: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: scrollAreaWidth,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
    },
});

export default ChapterScreen;
