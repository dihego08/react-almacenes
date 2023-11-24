import React, { useState, Component, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MapView, { Marker } from "react-native-maps";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';


export default (props) => {

    const [locationUpdates, setLocationUpdates] = useState([]);
    const [distance, setDistance] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [horaInicio, setHoraInicio] = useState("--");
    const [horaFin, setHoraFin] = useState("--");
    const [tiempo, setTiempo] = useState("--");
    const [imageSource, setImageSource] = useState(require('../assets/imgs/btn_iniciarruta.png'));
    var coordsAnterior = null;
    var auxiliar = 0;
    var laHoraInicio;
    const id = props.navigation.state.params;
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
            laHoraInicio = getCurrentTime();
            setHoraInicio(laHoraInicio);
            getCurrentLocationAndSendToAPI();
            const iId = setInterval(() => {
                getCurrentLocationAndSendToAPI();
            }, 10000);
            setIntervalId(iId);
            setImageSource(require('../assets/imgs/btn_terminarruta.png'));
        } else {
            clearInterval(intervalId);
            setHoraFin(getCurrentTime());
            const transcurrido = calculateTimeDifference(getCurrentTime());
            setTiempo(transcurrido);
            setImageSource(require('../assets/imgs/btn_iniciarruta.png'));
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
            //const transcurrido = calculateTimeDifference(getCurrentTime());

            //setTiempo(transcurrido);

            const startDate = new Date('2023-11-01T' + laHoraInicio + 'Z'); // Fecha inicial (puedes usar cualquier fecha)
            const endDate = new Date('2023-11-01T' + getCurrentTime() + 'Z'); // Fecha actual
            console.log(laHoraInicio);
            console.log(getCurrentTime());
            const differenceInMilliseconds = endDate - startDate;
            const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
            const differenceInMinutes = Math.floor(differenceInSeconds / 60);
            const differenceInHours = Math.floor(differenceInMinutes / 60);

            const formattedHours = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;
            const formattedMinutes = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
            const formattedSeconds = differenceInSeconds < 10 ? `0${differenceInSeconds}` : differenceInSeconds;
            //setTiempo(formattedHours + ":" + formattedMinutes + ":" + formattedSeconds);
            const transcurrido = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;

            var Data = {
                accuracy: locations[0].accuracy,
                altitude: locations[0].altitude,
                altitudeAccuracy: locations[0].altitudeAccuracy,
                heading: locations[0].heading,
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
                speed: locations[0].speed,
                id_usuario: id,
                id_vehiculo: 1,
                kilometraje: distance,
                _tiempo: transcurrido
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
        console.log("AKISTO" + horaInicio);
        console.log(horaFinal);
        const differenceInMilliseconds = endDate - startDate;
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);

        const formattedHours = differenceInHours < 10 ? `0${differenceInHours}` : differenceInHours;
        const formattedMinutes = differenceInMinutes < 10 ? `0${differenceInMinutes}` : differenceInMinutes;
        const formattedSeconds = differenceInSeconds < 10 ? `0${differenceInSeconds}` : differenceInSeconds;
        //setTiempo(formattedHours + ":" + formattedMinutes + ":" + formattedSeconds);
        return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
    };
    return (
        <View style={styles.viewStyle}>

            {/*------ENCABEZADO-----*/}
            <View style={styles.encabezado}>
                <View>
                    <Text style={styles.textotitulo1}>Iniciar Ruta</Text>
                    <Text style={styles.textosubtitulo}>¡Es hora de iniciar!</Text>
                </View>
                <View>
                    <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                </View>
            </View>
            {/*---------------------*/}

            <View style={styles.container}>
                <View style={styles.containersuperior}>
                    <Image style={styles.imgusuario} source={require('../assets/imgs/usuario_f.png')} />
                    <Text style={styles.nombre}>Yaraliz Gómez</Text>

                    {/*----BOTON PARTE2---*/}
                    <Pressable
                        onPress={handleButtonPress}
                        style={({ pressed }) => {
                            return { opacity: pressed ? 0 : 1 }
                        }}>
                        <Image style={styles.imageboton} source={imageSource} />
                    </Pressable>
                </View>

                <View style={styles.containerinfo}>
                    <View style={styles.iconocirculo}>
                        <MaterialIcons name='today' style={styles.iconos} />
                    </View>
                    <View style={styles.textoinfo}>
                        <Text><Text style={styles.texto1}>Fecha:</Text> <Text style={styles.texto2}>{getCurrentDate()}</Text></Text>
                        <Text><Text style={styles.texto1}>Hora Inicio:</Text> <Text style={styles.texto2}>{horaInicio}</Text></Text>
                        <Text><Text style={styles.texto1}>Hora Fin:</Text> <Text style={styles.texto2}>{horaFin}</Text></Text>
                    </View>
                </View>

                <View style={styles.containerinfo}>
                    <View style={styles.iconocirculo}>
                        <MaterialIcons name='directions-car' style={styles.iconos} />
                    </View>
                    <View style={styles.textoinfo}>
                        <Text><Text style={styles.texto1}>Kilometraje:</Text> <Text style={styles.texto2}>{distance} Kilómetros</Text></Text>
                        <Text><Text style={styles.texto1}>Tiempo:</Text> <Text style={styles.texto2}>{tiempo}</Text></Text>
                    </View>
                </View>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    /*----ESTILOS ENCABEZADO----*/
    encabezado: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    textotitulo1: {
        color: '#0000CC',
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    textosubtitulo: {
        color: '#0000CC',
        fontSize: 15,
        paddingLeft: 10,
    },
    textotitulo2: {
        color: '#0000CC',
        fontSize: 20,
        fontWeight: 'bold',
    },

    texto1: {
        color: '#0000CC',
        fontSize: 15,
        fontWeight: 'bold',
    },
    texto2: {
        color: '#0000CC',
        fontSize: 15,
    },
    imglogo: {
        width: 90,
        height: 90,
        marginLeft: 100,
    },
    /*----------------------------*/

    container: {
        flex: 1,
        padding: 20,
        paddingTop: 25,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,

    },
    containersuperior: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerinfo: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 13,
        margin: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        elevation: 7,
    },
    iconocirculo: {
        height: 70,
        width: 70,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 10,
        marginLeft: 5,
        marginTop: 10,
    },
    iconos: {
        fontSize: 40,
        paddingLeft: 15,
        paddingTop: 15,
        color: '#fff',
    },
    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    imageboton: {
        width: 395,
        height: 200,
    },
    imgusuario: {
        width: 90,
        height: 90,
    },
    nombre: {
        fontSize: 25,
        color: '#0000CC',
        fontWeight: 'bold',
    },



});