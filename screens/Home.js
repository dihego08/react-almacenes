import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, FlatList } from "react-native";
import * as Location from 'expo-location';

export default () => {
    const [userLocation, setUserLocation] = useState([]);
    const [locations, setLocations] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location);
            setUserLocation(location.coords);
        })();
    }, []);
    useEffect(() => {
        // Llamada a una función que obtiene datos de ubicaciones desde una API
        async function fetchLocationsFromAPI() {
            try {
                const response = await fetch('https://diegoaranibar.com/react/locations.php?accion=listar_ubicaciones');
                const data = await response.json();

                // Agrega las ubicaciones de la API a la lista existente
                const newLocations = data.map((item, index) => ({
                    id: item.id ? item.id : index + 3, // Comenzando desde 3 para evitar duplicados
                    coordinate: { latitude: parseFloat(item.latitude ? item.latitude : 0), longitude: parseFloat(item.longitude ? item.longitude : 0) },
                    title: item.nombres + " - " + item.placa,
                    nombres: item.nombres,
                    placa: item.placa
                }));
                console.log(newLocations);

                setLocations([...locations, ...newLocations]);
                setData([...locations, ...newLocations]); // Establece los datos obtenidos en el estado
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        }

        fetchLocationsFromAPI();
    }, []);
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cellTitle}>{item.nombres}</Text>
            <Text style={styles.cellText}>Vehículo: {item.placa}</Text>
            {/* Agrega más Text o componentes aquí según tus datos */}
        </View>
    );
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: -16.3995927, // Latitud de tu ubicación actual
                    longitude: -71.5392708, // Longitud de tu ubicación actual
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {locations.map(location => (
                    <Marker
                        key={location.id}
                        coordinate={location.coordinate}
                        title={location.title}
                    />
                ))}
            </MapView>
            
            <FlatList
                style={styles.lista}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()} // Ajusta la clave según la estructura de tus datos
            />
        </View>
        
    );
}
const styles = StyleSheet.create({
    map: {
        height: Dimensions.get('window').height - 100,
        width: Dimensions.get('window').width,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 8,
        marginBottom: 8,
    },
    headerText: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    row: {
        flexDirection: 'column',
        marginBottom: 5,
        backgroundColor: '#d9d9d9',
        padding: 10,
        borderRadius: 8
    },
    cellTitle: {
        flex: 1,
        fontWeight: 'bold',
        color: "#11115a",
        marginRight: 10,
    },
    cellText: {
        flex: 2,
        color: "#11115a",
        marginRight: 10,
    },
    lista: {
        padding: 10,
        height: 80,
        width: Dimensions.get('window').width,
    }
});
