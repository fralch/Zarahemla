import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { MATCHES_DATA } from '../../data/mockData';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2; // 20 padding on each side, divided by 2

const MatchItem = ({ item, colors }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
        <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
        />
        <View style={styles.infoContainer}>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}, {item.age}</Text>
            <Text style={[styles.bio, { color: colors.textSecondary }]} numberOfLines={2}>{item.bio || 'Sin descripción'}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.instaButton]}
                    onPress={() => Linking.openURL(item.instagram)}
                >
                    <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                </TouchableOpacity>

                {item.whatsapp && (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.waitButton]}
                        onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp}`)}
                    >
                        <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    </View>
);

const MatchesScreen = () => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.headerContainer, { backgroundColor: colors.card, shadowColor: colors.border }]}>
                <Text style={[styles.header, { color: colors.text }]}>Tus Matches</Text>
                <Text style={[styles.subHeader, { color: colors.textSecondary }]}>Personas que les gustaste</Text>
            </View>
            <FlatList
                data={MATCHES_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MatchItem item={item} colors={colors} />}
                numColumns={2}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 14,
        marginTop: 5,
    },
    list: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    itemContainer: {
        width: COLUMN_WIDTH,
        margin: 10,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: COLUMN_WIDTH * 1.2, // Aspect ratio 1:1.2
    },
    infoContainer: {
        padding: 12,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    bio: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 10,
        height: 32, // Fixed height for 2 lines
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 5,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.gray,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    // We don't need background colors anymore, we use icon colors
    instaButton: {
        // backgroundColor: '#fff',
    },
    waitButton: {
        // backgroundColor: '#fff',
    },
});

export default MatchesScreen;
