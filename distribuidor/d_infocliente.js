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
                        <Text style={styles.textotitulo1}>InfoCliente</Text>
                        <Text style={styles.textosubtitulo}>¡Estamos a su servicio!</Text>
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
                            <MaterialIcons name='perm-identity' style={styles.iconos} />
                        </View>
                        <Text><Text style={styles.texto1}>Nombre:</Text> <Text style={styles.texto2}>Juana</Text></Text>
                            <Text><Text style={styles.texto1}>Apellidos:</Text> <Text style={styles.texto2}>Torres Huamá</Text></Text>
                            <Text><Text style={styles.texto1}>Celular:</Text> <Text style={styles.texto2}>958412154</Text></Text>
                            <Text><Text style={styles.texto1}>Dirección:</Text> <Text style={styles.texto2}>Asc. Las Begonias</Text></Text>
                            <Text><Text style={styles.texto1}>Referencia:</Text> <Text style={styles.texto2}>A dos cuadras de la cancha de gras, cerca al parque</Text></Text>
                            <Text><Text style={styles.texto1}>Ruta:</Text> <Text style={styles.texto2}>Alto Selva Alegre</Text></Text>
                            
                        

                    </View>
                    <View style={styles.containerinfo}>
                        <View style={styles.contenedorfoto}>
                            <Image style={styles.foto} source={require('../assets/imgs/tiendaejemplo.jpg')} />
                            
                            {/* Button */}
                            <View style={styles.loginButtonSection}>
                                <Pressable
                                    style={styles.loginButton}
                                    onPress={() => {
                                        //this.InsertRecord()
                                    }}
                                >
                                    <View style={styles.contenidoboton}>
                                        <MaterialIcons name='location-on' style={styles.iconoboton} />
                                        <Text style={styles.textbtn}>Ubicación</Text>
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
        marginLeft: 100,
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
    contenedorfoto:{
        //marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foto:{
        height: 200,
        width: 200,

    },
    /*------BTOTON-------*/
    loginButtonSection: {
		width: '100%',
		marginTop: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
    contenidoboton:{
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    iconoboton: {
        fontSize: 25,
        color: '#fff', 
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
		width: 180,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		elevation: 5,
	},
    /*-----------------*/



});