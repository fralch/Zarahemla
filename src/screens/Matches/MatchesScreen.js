import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import { colors } from '../../theme/colors';

const MatchItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={[styles.avatar, { backgroundColor: item.color || colors.primary }]} />
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.actions}>
            <TouchableOpacity
                style={[styles.actionButton, styles.instaButton]}
                onPress={() => Linking.openURL(item.instagram)}
            >
                <Text style={styles.actionText}>IG</Text>
            </TouchableOpacity>
            {item.whatsapp && (
                <TouchableOpacity
                    style={[styles.actionButton, styles.waitButton]}
                    onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp}`)}
                >
                    <Text style={styles.actionText}>WA</Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const MatchesScreen = () => {
    const matches = [
        { id: '1', name: 'Ana', instagram: 'https://instagram.com/ana', whatsapp: '5491123456789', color: '#FF6B6B' },
        { id: '2', name: 'Beto', instagram: 'https://instagram.com/beto', whatsapp: '5491198765432', color: '#4ECDC4' },
        { id: '3', name: 'Carolina', instagram: 'https://instagram.com/carolina', whatsapp: '5491187654321', color: '#95E1D3' },
        { id: '4', name: 'Diego', instagram: 'https://instagram.com/diego', color: '#F38181' },
        { id: '5', name: 'Emilia', instagram: 'https://instagram.com/emilia', whatsapp: '5491176543210', color: '#AA96DA' },
        { id: '6', name: 'Fernando', instagram: 'https://instagram.com/fernando', whatsapp: '5491165432109', color: '#FCBAD3' },
        { id: '7', name: 'Gabriela', instagram: 'https://instagram.com/gabriela', color: '#A8D8EA' },
        { id: '8', name: 'Hernán', instagram: 'https://instagram.com/hernan', whatsapp: '5491154321098', color: '#FFD93D' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Matches</Text>
            <FlatList
                data={matches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MatchItem item={item} />}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 50,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
        marginLeft: 10,
    },
    list: {
        paddingBottom: 20,
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    instaButton: {
        backgroundColor: '#E1306C',
    },
    waitButton: {
        backgroundColor: '#25D366',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default MatchesScreen;
