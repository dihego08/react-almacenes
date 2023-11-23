import { withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { useState, Component, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, FlatList, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";


export default (props) => {
    const [userLocation, setUserLocation] = useState([]);
    const [locations, setLocations] = useState([]);
    const [data, setData] = useState([]);
    //const navigation = useNavigation();
   
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
                    placa: item.placa,
                    id_vehiculo: item.id_unidad,
                    id_conductor: item.id_user
                }));
                //console.log(newLocations);

                setLocations([...locations, ...newLocations]);
                setData([...locations, ...newLocations]); // Establece los datos obtenidos en el estado
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        }

        fetchLocationsFromAPI();
    }, []);
    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => navigate('LocalizaciónVehículo', { item })}
            style={({ pressed }) => {
                return { opacity: pressed ? 0 : 1 }
            }}>
            <View style={styles.containerinfo}>
                <View style={styles.iconocirculo}>
                    <MaterialIcons name='location-on' style={styles.iconos} />
                </View>
                <View style={styles.textoinfo}>
                    <Text style={styles.texto1}>{item.nombres}</Text>
                    <Text><Text style={styles.texto1}>Vehículo:</Text> <Text style={styles.texto2}>{item.placa}</Text></Text>

                </View>
            </View>
        </Pressable>
    );
    const { navigate } = props.navigation;
    return (
        /*----BOTON PARTE1---*/
        <View style={styles.viewStyle}>

            {/*------ENCABEZADO-----*/}
            <View style={styles.encabezado}>
                <View>
                    <Text style={styles.textotitulo1}>Localización</Text>
                    <Text style={styles.textosubtitulo}>¡Veamos!</Text>
                </View>
                <View>
                    <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                </View>
            </View>
            {/*---------------------*/}

            <View style={styles.container}>

                <View style={styles.contenedortitulo}>
                    <Text style={styles.textotitulo2}> UBICACIÓN DE VEHÍCULOS </Text>
                </View>

                <View style={styles.imagemapax2}>
                    <MapView
                        style={[{ flex: 1 }, styles.map]}
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
                </View>

                <FlatList
                    style={styles.lista}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()} // Ajusta la clave según la estructura de tus datos
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    map: {
        height: Dimensions.get('window').height - 100,
        width: Dimensions.get('window').width,
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
        marginLeft: 80,
    },
    /*----------------------------*/

    container: {
        flex: 1,
        padding: 20,
        paddingTop: 5,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,


    },
    contenedoraction: {
        padding: 10,
        justifyContent: 'center',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        width: '97%',

    },
    containerinfo: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 3,
        margin: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        elevation: 6,
    },
    iconocirculo: {
        height: 50,
        width: 50,
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 10,
    },
    iconos: {
        fontSize: 30,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#0000CC',
    },
    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    imagemapa: {
        width: 390,
        height: 315,
    },
    imagemapax2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1
    },
    contenedortitulo: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    lista: {
        padding: 0,
        height: 80,
    }
});