import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '../../../theme/colors';

const { width, height } = Dimensions.get('window');

const SwipeCard = ({ user }) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {/* Placeholder for actual image if user doesn't have one */}
                <View style={[styles.image, { backgroundColor: user.color || colors.primary }]} />
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{user.name}, {user.age}</Text>
            </View>
        </View>
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
});

export default SwipeCard;
