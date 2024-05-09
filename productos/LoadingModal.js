import React from 'react';
import { ActivityIndicator, Modal, View, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => { }}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingModal;