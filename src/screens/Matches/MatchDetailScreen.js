import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import MatchService from '../../services/MatchService';
import Loading from '../../components/Loading';
import { IMAGE_BASE_URL } from '../../services/ApiService';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const MatchDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { matchId } = route.params;
    const { theme } = useTheme();
    const colors = theme.colors;
    const { t } = useTranslation();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await MatchService.getMatchProfile(matchId);
                setProfile(data);
            } catch (error) {
                console.error('Failed to load match profile:', error);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [matchId]);

    const getImageUrl = (photo) => {
        if (!photo || !photo.url) return null;
        if (photo.url.startsWith('http')) return photo.url;
        return `${IMAGE_BASE_URL}${photo.url}`;
    };

    if (loading) {
        return <Loading />;
    }

    if (!profile) {
        return null;
    }

    const photos = profile.photos || [];

    const handleScroll = (event) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        if (slide !== activeSlide) {
            setActiveSlide(slide);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Photos Carousel */}
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {photos.length > 0 ? (
                            photos.map((photo, index) => (
                                <Image
                                    key={photo.id || index}
                                    source={{ uri: getImageUrl(photo) }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ))
                        ) : (
                             <View style={[styles.image, { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }]}>
                                <Ionicons name="person" size={100} color={colors.textSecondary} />
                            </View>
                        )}
                    </ScrollView>
                    
                    {/* Pagination Dots */}
                    {photos.length > 1 && (
                        <View style={styles.pagination}>
                            {photos.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        { backgroundColor: index === activeSlide ? colors.white : 'rgba(255, 255, 255, 0.5)' }
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Back Button */}
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {profile.name}, {profile.age}
                        </Text>
                        {profile.gender && (
                             <View style={[styles.genderTag, { borderColor: colors.border }]}>
                                <Ionicons 
                                    name={profile.gender === 'male' ? 'male' : 'female'} 
                                    size={16} 
                                    color={colors.textSecondary} 
                                />
                            </View>
                        )}
                    </View>

                    {profile.description && (
                        <Text style={[styles.bio, { color: colors.textSecondary }]}>
                            {profile.description}
                        </Text>
                    )}

                    {/* Social Actions */}
                    <View style={styles.actionsContainer}>
                        {profile.instagram && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.instaButton]}
                                onPress={() => Linking.openURL(`https://instagram.com/${profile.instagram.replace('@', '')}`)}
                            >
                                <Ionicons name="logo-instagram" size={24} color="#E1306C" />
                                <Text style={styles.actionText}>Instagram</Text>
                            </TouchableOpacity>
                        )}

                        {profile.whatsapp && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.whatsappButton]}
                                onPress={() => Linking.openURL(`https://wa.me/${profile.whatsapp.replace('+', '')}`)}
                            >
                                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                                <Text style={styles.actionText}>WhatsApp</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    {/* Other Details can go here */}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    carouselContainer: {
        height: 450,
        position: 'relative',
    },
    image: {
        width: width,
        height: 450,
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginRight: 10,
    },
    genderTag: {
        padding: 4,
        borderRadius: 4,
        borderWidth: 1,
    },
    bio: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    instaButton: {
        backgroundColor: '#FFF0F5',
        borderColor: '#FFC0CB',
    },
    whatsappButton: {
        backgroundColor: '#F0FFF4',
        borderColor: '#90EE90',
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    }
});

export default MatchDetailScreen;
