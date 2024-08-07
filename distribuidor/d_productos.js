import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable, Text, TextInput, TouchableOpacity } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class m_propietario extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            productos: [
                { nombre: 'AJINOMEN', tipo: 'Vino' },
                { nombre: 'Nombre de Producto', tipo: 'Vino' },
                { nombre: 'Nombre de Producto', tipo: 'Vino' },
                { nombre: 'Nombre de Producto', tipo: 'Vino' },
                { nombre: 'Nombre de Producto', tipo: 'Vino' },
            ]
        };
    }

    filtrarProductos = (text) => {
        this.setState({ searchText: text });
    }

    render() {
        const { navigate } = this.props.navigation;
        const { productos, searchText } = this.state;

        // Filtrar productos basados en el texto de búsqueda
        const productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(searchText.toLowerCase())
        );

        return (
            <View style={styles.viewStyle}>
                <View style={styles.encabezado}>
                    <View>
                        <Text style={styles.textotitulo1}>Productos</Text>
                        <Text style={styles.textosubtitulo}>¡Ofrecemos calidad!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='search' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Digite para filtrar"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={this.filtrarProductos}
                        />
                    </View>

                    {productosFiltrados.map((producto, index) => (
                        <Pressable
                            key={index}
                            onPress={() => navigate('InformaciónDeProducto')}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.containerinfo}>
                                <View style={styles.iconocirculo}>
                                    <MaterialIcons name='wine-bar' style={styles.iconos} />
                                </View>
                                <View style={styles.textoinfo}>
                                    <Text style={styles.texto1}>{producto.nombre}</Text>
                                    <Text><Text style={styles.texto1}>Tipo:</Text> <Text style={styles.texto2}>{producto.tipo}</Text></Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}

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