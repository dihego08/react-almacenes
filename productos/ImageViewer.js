import React, { useState } from 'react';
import { View, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ImageViewer = ({ isVisible, onClose, imageUri }) => {
    return (
        <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <Image source={{ uri: imageUri }} style={styles.fullImage} />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    },
});

export default ImageViewer;