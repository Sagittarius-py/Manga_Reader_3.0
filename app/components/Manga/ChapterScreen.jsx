import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import ImageZoom from "react-native-image-pan-zoom";

const windowWidth = Dimensions.get("window").width;

async function getSizes(url) {
    return new Promise((resolve, reject) => {
        Image.getSize(
            url,
            (width, height) => {
                resolve({ width, height });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

const ChapterScreen = () => {
    const route = useRoute();
    const { chapter } = route.params;
    const chapterId = chapter.id;

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error fetching chapter pages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapterPages();
    }, [chapterId]);

    const renderItem = ({ item }) => {
        // Pobierz wymiary obrazu i oblicz wysokość bez używania hooków
        let imageSize = { width: windowWidth, height: windowWidth }; // Domyślna wartość na wypadek błędu

        getSizes(item.url)
            .then((size) => {
                const aspectRatio = size.width / size.height;
                const calculatedHeight = windowWidth / aspectRatio;
                imageSize = { width: windowWidth, height: calculatedHeight };
            })
            .catch((error) => {
                console.error("Error getting image size:", error);
            });

        let aspectRatio = imageSize.height / imageSize.width


        return (
            <View style={[styles.pageContainer]}>
                <ImageZoom
                    imageWidth={Dimensions.get("window").width}
                    imageHeight={Dimensions.get("window").height * aspectRatio}
                    cropWidth={Dimensions.get("window").width}
                    cropHeight={Dimensions.get("window").height}
                >
                    <Image
                        source={{ uri: item.url }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMethod="scale"
                        resizeMode="contain"
                    />
                </ImageZoom>
            </View>
        );
    };

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
                data={pages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={4}
                windowSize={7}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1c1d22",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1c1d22",
    }
});

export default ChapterScreen;
