import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Linking, StatusBar, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import MatchService from '../../services/MatchService';
import Loading from '../../components/Loading';
import { IMAGE_BASE_URL } from '../../services/ApiService';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const MatchDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { matchId } = route.params;
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Full Screen Carousel */}
            <View style={styles.carouselContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
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
                         <View style={[styles.image, { backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' }]}>
                            <Ionicons name="person" size={100} color="#666" />
                        </View>
                    )}
                </ScrollView>
                
                {/* Pagination Dots */}
                {photos.length > 1 && (
                    <View style={[styles.pagination, { top: insets.top + 60 }]}>
                        {photos.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: index === activeSlide ? '#FFF' : 'rgba(255, 255, 255, 0.4)' },
                                    index === activeSlide && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Content Overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                locations={[0, 0.3, 0.6, 1]}
                style={styles.gradientOverlay}
                pointerEvents="none"
            />

            <View style={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.headerInfo}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>
                                {profile.name}, {profile.age}
                            </Text>
                            {profile.gender && (
                                <View style={styles.genderTag}>
                                    <Ionicons 
                                        name={profile.gender === 'male' ? 'male' : 'female'} 
                                        size={14} 
                                        color="#FFF" 
                                    />
                                    <Text style={styles.genderText}>
                                        {profile.gender === 'male' ? t('male') : t('female')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {profile.description && (
                        <Text style={styles.bio}>
                            {profile.description}
                        </Text>
                    )}

                    {/* Social Actions */}
                    <View style={styles.actionsContainer}>
                        {profile.instagram && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => Linking.openURL(`https://instagram.com/${profile.instagram.replace('@', '')}`)}
                            >
                                <View style={styles.socialContent}>
                                    <Ionicons name="logo-instagram" size={22} color="#E1306C" />
                                    <Text style={styles.actionText}>Instagram</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {profile.whatsapp && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => Linking.openURL(`https://wa.me/${profile.whatsapp.replace('+', '')}`)}
                            >
                                <View style={styles.socialContent}>
                                    <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                                    <Text style={styles.actionText}>WhatsApp</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* Back Button */}
            <TouchableOpacity 
                style={[styles.backButton, { top: insets.top + 10 }]} 
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    carouselContainer: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    image: {
        width: width,
        height: height,
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: height * 0.7, // Increased height for smoother transition
    },
    pagination: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    activeDot: {
        width: 6,
        height: 6,
        backgroundColor: '#FFF',
        transform: [{ scale: 1 }],
    },
    backButton: {
        position: 'absolute',
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        zIndex: 10,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerInfo: {
        marginBottom: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    genderTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    genderText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    bio: {
        fontSize: 15,
        lineHeight: 22,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 32,
        fontWeight: '400',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        borderRadius: 25, // Fully rounded
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 0.5,
    }
});

export default MatchDetailScreen;
