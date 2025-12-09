import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

const { width, height } = Dimensions.get('window');

const SWIPE_THRESHOLD = width * 0.3;

const SwipeCard = ({ user, onSwipeLeft, onSwipeRight }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = startX.value + event.translationX;
            translateY.value = startY.value + event.translationY;
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                // Swipe Right (Like)
                translateX.value = withSpring(width * 1.5, {}, () => {
                    runOnJS(onSwipeRight)();
                });
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                // Swipe Left (Dislike)
                translateX.value = withSpring(-width * 1.5, {}, () => {
                    runOnJS(onSwipeLeft)();
                });
            } else {
                // Return to center
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-width / 2, 0, width / 2],
            [-15, 0, 15]
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
            ],
        };
    });

    const likeOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1]
        );
        return { opacity };
    });

    const nopeOpacity = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0]
        );
        return { opacity };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, animatedStyle]}>
                <View style={styles.imageContainer}>
                    {user.image ? (
                        <Image source={{ uri: user.image }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={[styles.image, { backgroundColor: user.color || colors.primary }]} />
                    )}
                    {/* Like/Nope labels */}
                    <Animated.View style={[styles.likeLabel, likeOpacity]}>
                        <Text style={styles.likeLabelText}>ME GUSTA</Text>
                    </Animated.View>
                    <Animated.View style={[styles.nopeLabel, nopeOpacity]}>
                        <Text style={styles.nopeLabelText}>NOPE</Text>
                    </Animated.View>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{user.name}, {user.age}</Text>
                    {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    card: {
        width: width * 0.9,
        height: height * 0.7,
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: colors.gray,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    info: {
        padding: 20,
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    bio: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 5,
    },
    likeLabel: {
        position: 'absolute',
        top: 50,
        left: 40,
        transform: [{ rotate: '-20deg' }],
        borderWidth: 4,
        borderColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
    },
    likeLabelText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    nopeLabel: {
        position: 'absolute',
        top: 50,
        right: 40,
        transform: [{ rotate: '20deg' }],
        borderWidth: 4,
        borderColor: colors.error,
        borderRadius: 10,
        padding: 10,
    },
    nopeLabelText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.error,
    },
});

export default SwipeCard;
