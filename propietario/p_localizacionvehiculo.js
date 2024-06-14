import React, { useState, Component, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from 'react-navigation';
import MapView, { Marker } from "react-native-maps";


export default (props) => {

    const [data, setData] = useState([]);
    const [conductor, setConductor] = useState("");
    const [locationUpdates, setLocationUpdates] = useState([]);
    const [laLatitude, setLatitude] = useState(null);
    const [laLongitude, setLongitude] = useState(null);
    var lat;
    var lon;
    useEffect(() => {
        // Llamada a una función que obtiene datos de ubicaciones desde una API
        setLatitude(props.navigation.state.params.item.coordinate.latitude);
        setLongitude(props.navigation.state.params.item.coordinate.longitude);
        async function fetchLocationsFromAPI() {

            try {
                var APIURL = "https://inventarios.site/react/locations.php?accion=listar_ubicaciones_conductor";

                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };

                var Data = {
                    id_conductor: props.navigation.state.params.item.id_conductor
                };

                fetch(APIURL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data)
                })
                    .then((Response) => Response.json())
                    .then((Response) => {

                        setData(Response); // Establece los datos obtenidos en el estado


                    })
                    .catch((error) => {
                        console.error("ERROR FOUND" + error);
                    });
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        }
        
        fetchLocationsFromAPI();
    }, []);
    return (

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
                        style={[styles.map]}
                        initialRegion={{
                            latitude: -16.3995927, // Latitud de tu ubicación actual
                            longitude: -71.5392708, // Longitud de tu ubicación actual
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            key="1"
                            coordinate={{
                                latitude: laLatitude,
                                longitude: laLongitude,
                            }}
                            title={data.nombres}
                            description={data.placa}
                            pinColor="blue"
                        />

                    </MapView>
                </View>

                <View style={styles.contenedorelementos}>
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='person' style={styles.iconosbusca} />
                        </View>
                        <Text
                            placeholder="Conductor"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                        >
                            {data.nombres}
                        </Text>
                    </View>

                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='directions-car' style={styles.iconosbusca} />
                        </View>
                        <Text
                            placeholder="Vehículo"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                        >
                            {data.placa}
                        </Text>
                    </View>
                </View>
                <View style={styles.contenedorelementos}>
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='near-me' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Ubicación"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                        />
                    </View>

                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='gps-fixed' style={styles.iconosbusca} />
                        </View>
                        <Text
                            placeholder="Coordenadas"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                        >
                            {data.longitude},{data.latitude}
                        </Text>
                    </View>
                </View>
                <View style={styles.contenedorelementos}>
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='tour' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Paradas"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                        />
                    </View>

                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='av-timer' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Velocidad"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                        />
                    </View>
                </View>
                <View style={styles.contenedorelementos}>
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='speed' style={styles.iconosbusca} />
                        </View>
                        <Text
                            placeholder="Kilometraje"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}

                        >
                            {data.kilometraje}
                        </Text>
                    </View>

                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='schedule' style={styles.iconosbusca} />
                        </View>
                        <Text
                            placeholder="Tiempo"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}

                        >
                            {data.tiempo}
                        </Text>
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
        marginLeft: 80,
    },
    /*----------------------------*/

    container: {
        flex: 1,
        padding: 10,
        paddingTop: 5,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,
    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        width: '50%',

    },
    imagemapa: {
        width: 390,
        height: 330,
    },
    imagemapax2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contenedortitulo: {
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenedorelementos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    iconocirculobusca: {
        height: 30,
        width: 30,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 10,
        marginLeft: 10,
        marginRight: 3,
        marginTop: -8,
    },
    iconosbusca: {
        fontSize: 22,
        paddingTop: 3,
        paddingLeft: 4,
        color: '#fff',
    },
    textInput: {
        paddingStart: 20,
        marginTop: 3,
        height: 40,
        fontSize: 17,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        height: "100%",
        width: "100%",
        flex: 1
    }

});