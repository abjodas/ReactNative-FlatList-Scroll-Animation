import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";

import * as React from "react";

const SPACING = 20;
const AVATAR_SIZE = 70;
const URL = "https://jsonplaceholder.typicode.com/photos?_limit=20&page=1";
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

export default function App() {
  const [images, setImages] = React.useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      fetch(URL)
        .then((response) => response.json())
        .then((json) => setImages(json));
    };
    if (!images) {
      fetchData();
    }
  }, [images]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {!images && <ActivityIndicator />}

      <Image
        source={require("./bgimg2.jpeg")}
        style={StyleSheet.absoluteFillObject}
        blurRadius={80}
      />
      <Animated.FlatList
        data={images}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: StatusBar.currentHeight || 42,
          padding: SPACING,
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2),
          ];
          const opacityInputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 1),
          ];
          const opacity = scrollY.interpolate({
            inputRange: opacityInputRange,
            outputRange: [1, 1, 1, 0],
          });
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });
          return (
            <Animated.View
              style={{
                flexDirection: "row",
                padding: SPACING,
                marginBottom: SPACING,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                transform: [{ scale }],
                opacity,
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE,
                  marginRight: SPACING / 2,
                }}
              />
              <View style={{ width: 200 }}>
                <Text
                  style={{ fontSize: 22, fontWeight: "700" }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={{ fontSize: 18, opacity: 0.6 }}>
                  {item.albumId}
                </Text>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
