import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, FlatList, Button, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import axios from 'axios'; // Si decides usar Axios para las solicitudes HTTP
import { FontAwesome } from '@expo/vector-icons';

export default () => {
    const [locationUpdates, setLocationUpdates] = useState([]);
    const [distance, setDistance] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [horaInicio, setHoraInicio] = useState(null);
    const [horaFin, setHoraFin] = useState(null);
    const [tiempo, setTiempo] = useState(null);
    var coordsAnterior = null;
    var auxiliar = 0;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            } else {
                console.log("TENGO PERMISO DE LA UBICACIION");
            }
            return () => {
                clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
            };
        })();
    }, []);
    const handleButtonPress = () => {

        const newState = !isActive; // Cambiar al nuevo estado contrario
        setIsActive(newState);
        // Ejecuta la función si isActive es verdadero
        if (newState) {
            setHoraInicio(getCurrentTime());
            getCurrentLocationAndSendToAPI();
            const iId = setInterval(() => {
                getCurrentLocationAndSendToAPI();
            }, 10000);
            setIntervalId(iId);
        } else {
            clearInterval(intervalId);
            setHoraFin(getCurrentTime());
            calculateTimeDifference(getCurrentTime());
        }
    };
    const getCurrentLocationAndSendToAPI = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({});
            setLocationUpdates(prevUpdates => [...prevUpdates, location.coords]);

            if (auxiliar > 0) {
                //const prevLocation = locationUpdates[locationUpdates.length - 1];
                const newDistance = calculateDistance(
                    coordsAnterior.coords.latitude,
                    coordsAnterior.coords.longitude,
                    location.coords.latitude,
                    location.coords.longitude
                );
                console.log("LA DISTANCIA " + distance + newDistance);
                setDistance(distance + newDistance);
            }
            coordsAnterior = location;
            auxiliar = auxiliar + 1;
            await sendLocationToAPI([location.coords]);
            //auxiliar = parseInt(auxiliar) + 1;
        } catch (error) {
            console.error('Error al obtener la ubicación o enviar las ubicaciones:', error);
        }
    };

    const sendLocationToAPI = async (locations) => {
        try {
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            var Data = {
                accuracy: locations[0].accuracy,
                altitude: locations[0].altitude,
                altitudeAccuracy: locations[0].altitudeAccuracy,
                heading: locations[0].heading,
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
                speed: locations[0].speed,
                id_usuario: 1,
                id_vehiculo: 1,
            };
            fetch("https://diegoaranibar.com/react/locations.php?accion=guardar_ubicacion", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data)
            })
                .then((Response) => Response.json())
                .then((Response) => {
                    console.log("HECHO");
                })
                .catch((error) => {
                    console.error("ERROR FOUND" + error);
                })
        } catch (error) {
            console.error('Error al enviar las ubicaciones:', error);
        }
    };
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        // Fórmula haversine para calcular la distancia entre dos coordenadas
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };
    const getCurrentDate = () => {
        const date = new Date();
        const day = date.getDate(); // Obtener el día del mes
        const month = date.getMonth() + 1; // Obtener el mes (los meses comienzan desde 0)
        const year = date.getFullYear(); // Obtener el año

        // Agregar un cero delante si el día o el mes es menor que 10 para tener dos dígitos
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };
    const getCurrentTime = () => {
        const date = new Date();
        const hours = date.getHours(); // Obtener las horas actuales
        const minutes = date.getMinutes(); // Obtener los minutos actuales
        const seconds = date.getSeconds(); // Obtener los segundos actuales

        // Formatear los componentes de la hora con dos dígitos si es necesario
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`; // Devolver la hora en formato hh:mm:ss
    };
    const calculateTimeDifference = (horaFinal) => {
        const startDate = new Date('2023-11-01T' + horaInicio + 'Z'); // Fecha inicial (puedes usar cualquier fecha)
        const endDate = new Date('2023-11-01T' + horaFinal + 'Z'); // Fecha actual

        const differenceInMilliseconds = endDate - startDate;
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);

        const formattedHours = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;
        const formattedMinutes = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
        const formattedSeconds = differenceInSeconds < 10 ? `0${differenceInSeconds}` : differenceInSeconds;
        setTiempo(formattedHours + ":" + formattedMinutes + ":" + formattedSeconds);
    };
    return (
        <View style={styles.container}>
            {(locationUpdates.length > 0 && isActive) ? (
                <View style={{ flex: 1 }}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: locationUpdates[0].latitude,
                            longitude: locationUpdates[0].longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {locationUpdates.map((location, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                title="Mi Ubicación"
                                description="Estoy aquí"
                                pinColor="blue"
                            />
                        ))}
                    </MapView>
                </View>
            ) : (
                <Text style={{ flex: 1 }}>{isActive ? 'Cargando Mapa...' : 'Esperando Iniciar...'}</Text>
            )}

            <View style={{ flex: 2, flexDirection: 'column', backgroundColor: "#11115a", width: "100%" }}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: "100%",
                    backgroundColor: "#11115a",
                    flex: 0,
                    padding: 0
                }}>
                    <TouchableOpacity onPress={handleButtonPress} style={[styles.button, isActive ? styles.prendido : styles.apagado]}>
                        <FontAwesome name="power-off" size={20} color="white"></FontAwesome>
                        <Text style={{ color: "white" }}>{isActive ? 'Terminar' : 'Iniciar'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingLeft: 35, width: '100%', flexDirection: "column", flex: 2, paddingRight: 35, paddingTop: 15 }}>
                    <View style={{ flexDirection: 'row', width: '100%', height: "50", backgroundColor: "#d9d9d9", flex: 2, borderRadius: 15, alignItems: 'center' }}>
                        <View style={{
                            width: "30%",
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 30,
                            width: 40,
                            height: 40,
                            backgroundColor: "#11115a",
                            marginLeft: 10,
                            marginRight: 10
                        }}>
                            <FontAwesome name="calendar" size={20} color="white"></FontAwesome>
                        </View>
                        <View style={{ width: "70%", flexDirection: 'column', color: "#11115a" }}>
                            <Text style={styles.texto}>Fecha: {getCurrentDate()}</Text>
                            <Text style={styles.texto}>Hora Inicio: {horaInicio}</Text>
                            <Text style={styles.texto}>Hora Fin: {horaFin}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "#d9d9d9", flex: 2, marginTop: 15, borderRadius: 15, alignItems: 'center' }}>
                        <View style={{
                            width: "30%",
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 30,
                            width: 40,
                            height: 40,
                            backgroundColor: "#11115a",
                            marginLeft: 10,
                            marginRight: 10
                        }}>
                            <FontAwesome name="car" size={20} color="white"></FontAwesome>
                        </View>

                        <View style={{ width: "70%", flexDirection: 'column' }}>
                            <Text style={styles.texto}>Kilometraje: {distance} Kilómetros</Text>
                            <Text style={styles.texto}>Tiempo: {tiempo}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    map: {
        /*height: Dimensions.get('window').height - 50vh,*/
        flex: 1,
        width: Dimensions.get('window').width,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationList: {
        marginTop: 10,
    },
    image: {
        width: '100%',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        marginTop: -40,
        zIndex: 10,
        shadowColor: "#313131",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,

        elevation: 13,
        borderRadius: 30, // La mitad del ancho/altura para hacerlo redondo
        //elevation: 3, // Sombra para una apariencia elevada
    },
    apagado: {
        backgroundColor: "#24d336",
        color: "#ffffff"
    },
    prendido: {
        backgroundColor: "#d32424",
        color: "#ffffff"
    },
    texto: {
        color: "#11115a"
    },
});