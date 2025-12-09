import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeContext';
import { colors } from '../../../theme/colors';

const { width, height } = Dimensions.get('window');

const SWIPE_THRESHOLD = width * 0.3;

const SwipeCard = forwardRef(({ user, onSwipeLeft, onSwipeRight }, ref) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        swipeLeft: () => {
            translateX.value = withSpring(-width * 1.5, {}, () => {
                runOnJS(onSwipeLeft)();
            });
        },
        swipeRight: () => {
            translateX.value = withSpring(width * 1.5, {}, () => {
                runOnJS(onSwipeRight)();
            });
        },
    }));

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
            <Animated.View style={[styles.card, animatedStyle, { backgroundColor: colors.card }]}>
                {user.image ? (
                    <Image source={{ uri: user.image }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={[styles.image, { backgroundColor: user.color || colors.primary }]} />
                )}

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <View style={styles.info}>
                        <Text style={styles.name}>{user.name}, {user.age}</Text>
                        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
                    </View>
                </LinearGradient>

                {/* Like/Nope labels */}
                <Animated.View style={[styles.likeLabel, { borderColor: colors.success }, likeOpacity]}>
                    <Ionicons name="heart" size={80} color={colors.success} />
                </Animated.View>
                <Animated.View style={[styles.nopeLabel, { borderColor: colors.error }, nopeOpacity]}>
                    <Ionicons name="close" size={80} color={colors.error} />
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create({
    card: {
        width: width * 0.9,
        height: height * 0.75, // Taller card
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%', // Cover bottom 40% with gradient
        justifyContent: 'flex-end',
        padding: 20,
    },
    info: {
        marginBottom: 20,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    bio: {
        fontSize: 18,
        color: colors.white,
        marginTop: 5,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent bg
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
});

export default SwipeCard;
