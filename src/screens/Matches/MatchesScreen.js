import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import { colors } from '../../theme/colors';

const MatchItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.avatar} />
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
        { id: '1', name: 'Ana', instagram: 'https://instagram.com/ana', whatsapp: '123456789' },
        { id: '2', name: 'Beto', instagram: 'https://instagram.com/beto' },
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
        backgroundColor: colors.gray,
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
