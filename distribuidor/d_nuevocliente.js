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
                        <Text style={styles.textotitulo1}>Clientes</Text>
                        <Text style={styles.textosubtitulo}>¡Estamos a su servicio!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View>
                {/*---------------------*/}

                <View style={styles.container}>


                    <View style={styles.contenedoraction}>
                    <Text style={styles.textotitulo2}> NUEVO CLIENTE </Text>
                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='person' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Nombre de Cliente"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='person' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Apellidos de Cliente"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='smartphone' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Celular"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='store-mall-directory' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Dirección"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='tour' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Referencia"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='directions-car' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Ruta"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='photo' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Tienda"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='photo-camera' style={styles.iconosbusca} />
                            </View>
                        </View>

                        <View style={styles.action}>
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='location-on' style={styles.iconosbusca} />
                            </View>
                            <TextInput
                                placeholder="Ubicación"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                onChangeText={email => this.setState({ email })}
                            />
                            <View style={styles.iconocirculobusca}>
                                <MaterialIcons name='location-searching' style={styles.iconosbusca} />
                            </View>
                        </View>

                        {/* Button */}
                        <View style={styles.loginButtonSection}>
                                <Pressable
                                    style={styles.loginButton}
                                    onPress={() => {
                                        //this.InsertRecord()
                                    }}
                                >
                                    <View style={styles.contenidoboton}>
                                        <MaterialIcons name='save' style={styles.iconoboton} />
                                        <Text style={styles.textbtn}>Registrar Cliente</Text>
                                    </View>
                                </Pressable>
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
        paddingBottom: 20,
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
        padding: 30,
        paddingTop: 3,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,

    },
    contenedoraction: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        paddingStart: 20,
        marginTop: 3,
        marginBottom: 10,
        height: 40,
        fontSize: 17,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },

    action: {
        flexDirection: 'row',
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
        marginRight: 3,
        marginTop: -8,
    },
    iconosbusca: {
        fontSize: 22,
        paddingTop: 3,
        paddingLeft: 4,
        color: '#fff',
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
    width: 210,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    elevation: 5,
},
/*-----------------*/

});