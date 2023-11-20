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
                        <Text style={styles.textotitulo1}>Pedidos</Text>
                        <Text style={styles.textosubtitulo}>¡Siempre cumpliendo!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View>
                {/*---------------------*/}

                <View style={styles.container}>

                    {/*--------BUSCAR-------------*/}
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='search' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Digite para filtrar"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                        />
                    </View>
                    {/*--------------------------*/}

                    <Pressable
                        onPress={() => navigate('InformaciónDePedido')}
                        style={({ pressed }) => {
                            return { opacity: pressed ? 0 : 1 }
                        }}>
                        <View style={styles.containerinfo}>
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='receipt-long' style={styles.iconos} />
                            </View>
                            <View style={styles.textoinfo}>
                                <Text style={styles.texto1}>Número de Pedido</Text>
                                <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva alegre</Text></Text>
                                <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>
                            </View>
                        </View>
                    </Pressable>

                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='receipt-long' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Número de Pedido</Text>
                            <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva alegre</Text></Text>
                            <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>
                        </View>
                    </View>
                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='receipt-long' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Número de Pedido</Text>
                            <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva alegre</Text></Text>
                            <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>
                        </View>
                    </View>
                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='receipt-long' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Número de Pedido</Text>
                            <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva alegre</Text></Text>
                            <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>
                        </View>
                    </View>
                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='receipt-long' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text style={styles.texto1}>Número de Pedido</Text>
                            <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva alegre</Text></Text>
                            <Text><Text style={styles.texto1}>Estado:</Text> <Text style={styles.texto2}>PENDIENTE</Text></Text>
                        </View>
                    </View>

                    {/*--------FLOTANTE NUEVO CLIENTE-------------*/}
                    <Pressable
                        onPress={() => navigate('NuevoPedido')}
                        style={({ pressed }) => {
                            return { opacity: pressed ? 0 : 1 }
                        }}>
                        <View style={styles.iconocirculoflotante}>
                            <MaterialIcons name='add' style={styles.iconosflotante} />
                        </View>
                    </Pressable>
                    {/*-------------------------------------------*/}


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
        marginLeft: 100,
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
    textInput: {
        paddingStart: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        fontSize: 17,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        width: '97%',

    },
    iconocirculobusca: {
        height: 30,
        width: 30,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 10,
        marginLeft: 10,
        marginTop: 3,
    },
    iconosbusca: {
        fontSize: 22,
        paddingTop: 4,
        paddingLeft: 4,
        marginRight: 3,
        color: '#fff',
    },
    containerinfo: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        paddingTop: 5,
        margin: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        elevation: 6,
    },
    iconocirculo: {
        height: 60,
        width: 60,
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 10,
    },
    iconos: {
        fontSize: 40,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#0000CC',
    },
    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    iconocirculoflotante: {
        bottom: 3,
        right: 0,
        position: "absolute",
        height: 80,
        width: 80,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 10,
    },
    iconosflotante: {
        fontSize: 60,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#fff',
    },



});