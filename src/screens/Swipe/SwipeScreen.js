import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import SwipeCard from './components/SwipeCard';

const SwipeScreen = () => {
    // Mock data
    const users = [
        { id: '1', name: 'Laura', age: 24, color: '#FF6B6B', bio: 'Me encanta viajar y la fotografía' },
        { id: '2', name: 'Sofia', age: 22, color: '#4ECDC4', bio: 'Amante del café y los libros' },
        { id: '3', name: 'Valentina', age: 26, color: '#95E1D3', bio: 'Diseñadora gráfica y foodie' },
        { id: '4', name: 'Camila', age: 23, color: '#F38181', bio: 'Runner y amante de la naturaleza' },
        { id: '5', name: 'Isabella', age: 25, color: '#AA96DA', bio: 'Músico y artista' },
        { id: '6', name: 'Martina', age: 27, color: '#FCBAD3', bio: 'Chef profesional' },
        { id: '7', name: 'Lucia', age: 24, color: '#A8D8EA', bio: 'Yoga y meditación' },
        { id: '8', name: 'Daniela', age: 28, color: '#FFD93D', bio: 'Travel blogger' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            {/* In a real app, use a Swiper lib here */}
            <View style={styles.cardContainer}>
                {currentIndex < users.length ? (
                    <SwipeCard user={users[currentIndex]} />
                ) : (
                    <View style={styles.noMoreCards}>
                        <Text style={styles.noMoreText}>No hay más perfiles por ahora</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    noMoreText: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default SwipeScreen;
