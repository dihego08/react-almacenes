import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';

export default () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locations, setLocations] = useState([
        /*{ id: 1, coordinate: { latitude: 37.78825, longitude: -122.4324 }, title: 'Marker 1' },
        { id: 2, coordinate: { latitude: 37.78845, longitude: -122.4326 }, title: 'Marker 2' },
        { id: 3, coordinate: { latitude: -16.3971072, longitude: -71.51616 }, title: 'Marker 2' },*/
    ]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
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
                    id: index + 3, // Comenzando desde 3 para evitar duplicados
                    coordinate: { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) },
                    title: "Ubicación de ejemplo",
                }));
                console.log(newLocations);

                setLocations([...locations, ...newLocations]);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        }

        fetchLocationsFromAPI();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: userLocation ? userLocation.latitude : -16.3995927, // Latitud de tu ubicación actual
                    longitude: userLocation ? userLocation.longitude : -71.5392708, // Longitud de tu ubicación actual
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={userLocation} // Marcador para tu ubicación actual
                    title="Tu ubicación"
                    pinColor="blue" // Puedes personalizar el color del marcador
                />

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        coordinate={location.coordinate}
                        title={location.title}
                    />
                ))}
            </MapView>
            
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
});
