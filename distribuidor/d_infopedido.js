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
                        <Text style={styles.textotitulo1}>InfoPedido</Text>
                        <Text style={styles.textosubtitulo}>¡Siempre cumpliendo!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View>
                {/*---------------------*/}

                <View style={styles.container}>

                    <View style={styles.containerinfo}>

                        <View style={styles.textoinfo}>
                        </View>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='receipt-long' style={styles.iconos} />
                        </View>
                        <Text><Text style={styles.texto1}>Número:</Text> <Text style={styles.texto2}>000-012</Text></Text>
                        <Text><Text style={styles.texto1}>Fecha:</Text> <Text style={styles.texto2}>13/07/2023</Text></Text>
                        <Text><Text style={styles.texto1}>Nombre:</Text> <Text style={styles.texto2}>Juana</Text></Text>
                        <Text><Text style={styles.texto1}>Apellidos:</Text> <Text style={styles.texto2}>Torres Huamán</Text></Text>
                        <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva Alegre</Text></Text>
                        <Text><Text style={styles.texto1}>Pedido:</Text> <Text style={styles.texto2}>1 caja de vinos rose, 5 ron cartavio, 1/2 caja sabor limon</Text></Text>
                        <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>



                    </View>
                    <View style={styles.containerinfo2}>
                        <View>
                            {/* Button */}
                            <View style={styles.loginButtonSection}>
                                <Pressable
                                    style={styles.loginButton2}   
                                    onPress={() => navigate('InformaciónDeCliente')}
                                    styles={({ pressed }) => {return { opacity: pressed ? 0 : 1 }}}>
                                
                                    <View style={styles.contenidoboton}>
                                        <MaterialIcons name='face-retouching-natural' style={styles.iconoboton} />
                                    </View>
                                </Pressable>
                            </View>
                        </View>

                        <View>    
                            {/* Button */}
                            <View style={styles.loginButtonSection}>
                                <Pressable
                                    style={styles.loginButton}   
                                    onPress={() => navigate('EntregaDePedido')}
                                    styles={({ pressed }) => {return { opacity: pressed ? 0 : 1 }}}>
                               
                                    <View style={styles.contenidoboton}>
                                        <MaterialIcons name='check-circle-outline' style={styles.iconoboton} />
                                        <Text style={styles.textbtn}>Entregar</Text>
                                    </View>
                                </Pressable>
                            </View>
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
        paddingTop: 30,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        width: '97%',

    },
    containerinfo: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 20,
        paddingTop: 0,
        margin: 8,
        elevation: 6,        
    },
    containerinfo2: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 20,
        paddingTop: 0,
        margin: 8,
        elevation: 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconocirculo: {
        height: 65,
        width: 65,
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    iconos: {
        fontSize: 45,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#0000CC',
    },

    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    
    foto: {
        height: 200,
        width: 200,

    },
    /*------BTOTON-------*/
    loginButtonSection: {
        width: '100%',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 10,
    },
    contenidoboton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    iconoboton: {
        fontSize: 25,
        color: '#fff',
        paddingRight: 5,
    },
    textbtn: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    loginButton: {
        backgroundColor: '#0000CC',
        color: 'white',
        height: 40,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
    },
    loginButton2: {
        backgroundColor: '#0000CC',
        color: 'white',
        height: 40,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
        
    },
    /*-----------------*/



});