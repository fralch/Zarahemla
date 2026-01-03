import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

const CustomAlert = ({
  visible,
  title,
  message,
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  buttons = [],
  onClose,
}) => {
  const { theme } = useTheme();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 100,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset values when hidden
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible]);

  // If not visible, we can still render null, but for animation out we might need to handle it differently.
  // For simplicity, we just rely on the parent to unmount or we hide it.
  // But standard Modal unmounts content.
  // To animate out, we would need to delay hiding the modal.
  // For now, let's keep it simple: Animate IN. Animate OUT is tricky with Modal without extra state.
  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: theme.colors.success };
      case 'error': return { name: 'alert-circle', color: theme.colors.error };
      case 'warning': return { name: 'warning', color: '#FFC107' }; // Amber
      default: return { name: 'information-circle', color: theme.colors.primary };
    }
  };

  const iconData = getIcon();

  const renderButtons = () => {
    if (!buttons || buttons.length === 0) {
      return (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary, minWidth: 140 }]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>OK</Text>
        </TouchableOpacity>
      );
    }

    return buttons.map((btn, index) => {
        const isCancel = btn.style === 'cancel';
        const isDestructive = btn.style === 'destructive';
        
        let bgColor = theme.colors.primary;
        let textColor = theme.colors.white;
        let borderColor = 'transparent';
        
        if (isCancel) {
            bgColor = 'transparent';
            textColor = theme.colors.textSecondary;
            borderColor = theme.colors.border;
        } else if (isDestructive) {
            bgColor = theme.colors.error;
        }

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.button, 
                    { backgroundColor: bgColor, borderColor: borderColor },
                    isCancel && { borderWidth: 1 },
                    buttons.length === 1 && { minWidth: 140 },
                    buttons.length > 1 && { flex: 1, marginHorizontal: 5 },
                    buttons.length > 2 && { marginHorizontal: 0, marginBottom: 10, width: '100%' }
                ]}
                onPress={btn.onPress}
            >
                <Text style={[styles.buttonText, { color: textColor }]}>{btn.text}</Text>
            </TouchableOpacity>
        );
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View 
            style={[
                styles.alertContainer, 
                { 
                    backgroundColor: theme.colors.card,
                    opacity: opacityValue,
                    transform: [{ scale: scaleValue }]
                }
            ]}
        >
          <View style={styles.iconContainer}>
             <Ionicons name={iconData.name} size={60} color={iconData.color} />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text> : null}

          <View style={[
              styles.buttonContainer, 
              buttons.length > 2 
                ? { flexDirection: 'column' } 
                : { 
                    flexDirection: 'row', 
                    justifyContent: (!buttons || buttons.length <= 1) ? 'center' : 'space-between' 
                  }
            ]}>
            {renderButtons()}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
