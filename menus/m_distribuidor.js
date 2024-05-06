import React, { Component } from "react";
import { StyleSheet, View, Image, Pressable, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class m_propietario extends Component {

    constructor(props) {

        super(props);
        this.state = {
            nombres: '',
            sede: ''
        };

    }
    componentDidMount() {
        AsyncStorage.getItem('usuarioLogin').then((storedData) => {
            const dataLogin = JSON.parse(storedData);
            this.setState({
                nombres: dataLogin.nombres,
                sede: dataLogin.sede
            });
        }).catch((error) => {
            console.error('Error al obtener datos del usuario:', error);
        });
    }
    render() {

        /*----BOTON MENU-PARTE1---*/
        const { nombres, sede } = this.state;
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.viewStyle}>

                {/*------ENCABEZADO-----*/}
                <View style={styles.encabezado}>
                    <View>
                        <Text style={styles.textotitulo1}>Hola, {nombres}</Text>
                        <Text style={styles.texto2}>¡Bienvenid(a)! </Text>
                        <Text style={styles.cuenta}><Text style={styles.texto1}>Sede:</Text> <Text style={styles.texto2}>{sede}</Text></Text>
                    </View>
                </View>
                {/*---------------------*/}

                <View style={styles.container}>

                    <View style={styles.imagelogox2}>
                        <Image style={styles.imagelogo} source={require('../assets/imgs/logoeg.png')} />
                    </View>

                    <View style={styles.menu}>
                        <Pressable
                            onPress={() => navigate('ProductosDistribuidor')}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <Image style={styles.imageboton} source={require('../assets/imgs/menu_catalogo.png')} />
                        </Pressable>
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
    texto1: {
        color: '#0000CC',
        fontSize: 15,
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    texto2: {
        color: '#0000CC',
        fontSize: 15,
        paddingLeft: 10,
    },
    cuenta: {
        paddingLeft: 10,
    },
    imgusuario: {
        width: 80,
        height: 80,
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
    menu: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageboton: {
        width: 130,
        height: 130,
        marginLeft: 15,
    },
    imagelogo: {
        width: 110,
        height: 110,
    },
    imagelogox2: {
        justifyContent: 'center',
        alignItems: 'center',
    },




});