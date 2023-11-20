import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable, Text, TextInput, TouchableOpacity } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class m_propietario extends Component {

    constructor(props) {

        super(props);



    }
    render() {
        /*----BOTON PARTE1---*/
        const { navigate } = this.props.navigation;
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
                        <Image style={styles.imagemapa} source={require('../assets/imgs/mapaejemplo.jpg')} />
                    </View>


                    <Pressable
                        onPress={() => navigate('LocalizaciónVehículo')}
                        style={({ pressed }) => {
                            return { opacity: pressed ? 0 : 1 }
                        }}>
                        <View style={styles.containerinfo}>
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='location-on' style={styles.iconos} />
                            </View>
                            <View style={styles.textoinfo}>
                                <Text style={styles.texto1}>Nombre de chofer</Text>
                                <Text><Text style={styles.texto1}>Vehículo:</Text> <Text style={styles.texto2}>Placa</Text></Text>

                            </View>
                        </View>
                    </Pressable>

                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='location-on' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Nombre de chofer</Text>
                            <Text><Text style={styles.texto1}>Vehículo:</Text> <Text style={styles.texto2}>Placa</Text></Text>

                        </View>
                    </View>
                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='location-on' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Nombre de chofer</Text>
                            <Text><Text style={styles.texto1}>Vehículo:</Text> <Text style={styles.texto2}>Placa</Text></Text>

                        </View>
                    </View>
                </View>
            </View>



        );
    }
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
    },
    contenedortitulo: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },


});