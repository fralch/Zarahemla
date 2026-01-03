import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';
import MatchService from '../../services/MatchService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IMAGE_BASE_URL } from '../../services/ApiService';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2; // 20 padding on each side, divided by 2

const MatchItem = ({ item, colors, t, navigation }) => {
    const user = item.other_profile;

    const getProfileImage = (userProfile) => {
        if (userProfile.photo) {
             const photoUrl = userProfile.photo;
             if (photoUrl.startsWith('http')) return photoUrl;
             return `${IMAGE_BASE_URL}${photoUrl}`;
        }
        if (userProfile.photos && userProfile.photos.length > 0) {
            const sortedPhotos = [...userProfile.photos].sort((a, b) => a.order - b.order);
            const photo = sortedPhotos[0];
            const photoUrl = photo.url;
            if (photoUrl.startsWith('http')) return photoUrl;
            return `${IMAGE_BASE_URL}${photoUrl}`;
        }
        return userProfile.image;
    };

    const imageUrl = getProfileImage(user);

    return (
        <TouchableOpacity 
            style={[styles.itemContainer, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.image, { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="person" size={40} color={colors.textSecondary} />
                </View>
            )}
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: colors.text }]}>{user.name}, {user.age}</Text>
                <Text style={[styles.bio, { color: colors.textSecondary }]} numberOfLines={2}>{user.bio || user.description || t('matches.noDescription')}</Text>

                <View style={styles.actions}>
                    {user.instagram && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.instaButton, { backgroundColor: colors.gray }]}
                            onPress={() => Linking.openURL(user.instagram)}
                        >
                            <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                        </TouchableOpacity>
                    )}

                    {user.whatsapp && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.waitButton, { backgroundColor: colors.gray }]}
                            onPress={() => Linking.openURL(`https://wa.me/${user.whatsapp}`)}
                        >
                            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const MatchesScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();
    const [matches, setMatches] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useFocusEffect(
        React.useCallback(() => {
            const loadMatches = async () => {
                setLoading(true);
                try {
                    const data = await MatchService.getMatches();
                    setMatches(data);
                } catch (error) {
                    console.error('Failed to load matches:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadMatches();
        }, [])
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.headerContainer, { backgroundColor: colors.card, shadowColor: colors.border }]}>
                <Text style={[styles.header, { color: colors.text }]}>{t('matches.title')}</Text>
                <Text style={[styles.subHeader, { color: colors.textSecondary }]}>{t('matches.subtitle')}</Text>
            </View>
            <FlatList
                data={matches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MatchItem item={item} colors={colors} t={t} navigation={navigation} />}
                numColumns={2}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.dark ? '#333' : '#F0F0F0' }]}>
                            <Ionicons name="heart-dislike-outline" size={80} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t('matches.noMatchesTitle') || "No Matches Yet"}
                        </Text>
                        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                            {t('matches.noMatchesSubtitle') || "Start exploring to find people nearby."}
                        </Text>
                        <TouchableOpacity
                            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('Swipe')}
                        >
                            <Text style={styles.exploreButtonText}>
                                {t('matches.exploreButton') || "Start Swiping"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
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
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 50,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    exploreButton: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MatchesScreen;
