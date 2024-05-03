import { withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { useState, Component, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, FlatList, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';



export default (props) => {
    const [searchText, setSearchText] = useState('');
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        async function fetchLocationsFromAPI() {
            try {
                const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'uploads');
                if (!directoryInfo.exists) {
                    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'uploads', { intermediates: true });
                }

                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_inventario');
                const data = await response.json();
                const inventarios = data.map(item => ({
                    nombre: item.descripcion,
                    sede: item.sede,
                    cuenta: item.cuenta,
                    id: item.id,
                    foto: item.foto
                }));

                for (const inventario of inventarios) {
                    const fotoExists = await checkFileExists(inventario.foto);
                    if (fotoExists) {
                        console.log('La imagen existe:', inventario.foto);
                    } else {
                        console.log('La imagen no existe, descargando:', inventario.foto);
                        await downloadImage(inventario.foto);
                    }
                }
                setProductos(inventarios);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        }
        fetchLocationsFromAPI();
    }, []);

    const { navigate } = props.navigation;

    const downloadImage = async (foto) => {
        if (foto) {
            const uri = 'https://diegoaranibar.com/almacen/servicios/uploads/' + foto;
            const fileUri = FileSystem.documentDirectory + 'uploads/' + foto;

            try {
                const { uri: downloadedImageUri } = await FileSystem.downloadAsync(uri, fileUri);
                console.log('Imagen descargada con éxito:', downloadedImageUri);
            } catch (error) {
                console.error('Error al descargar la imagen:', error);
            }
        }
    };
    const checkFileExists = async (foto) => {
        const fileUri = FileSystem.documentDirectory + foto;
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            return fileInfo.exists;
        } catch (error) {
            console.error('Error al verificar si el archivo existe:', error);
            return false;
        }
    };

    const filtrarProductos = (text) => {
        setSearchText(text);
    }

    // Filtrar productos basados en el texto de búsqueda
    const productosFiltrados = searchText ? productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchText.toLowerCase())
    ) : productos;
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
                        onChangeText={filtrarProductos} // Usa la función filtrarProductos directamente aquí
                    />
                </View>
                <ScrollView style={styles.scrollView}>
                    {productosFiltrados.map((producto, index) => (
                        <Pressable
                            key={index}
                            onPress={() => navigate('InformacionProducto', {
                                id: producto.id
                            })}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.containerinfo}>
                                <View style={styles.iconocirculo}>
                                    {/*<MaterialIcons name='wine-bar' style={styles.iconos} />*/}
                                    <Image style={styles.imagenProducto} source={{ uri: FileSystem.documentDirectory + 'uploads/' + producto.foto }} />
                                </View>
                                <View style={styles.textoinfo}>
                                    <Text style={styles.texto1}>{producto.nombre}</Text>
                                    <Text>
                                        <Text style={styles.texto2}>{producto.sede}</Text>
                                    </Text>
                                </View>
                                {/*<View>
                                    <Text style={styles.texto1}>Cuenta: {producto.cuenta}</Text>
                                </View>*/}
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
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
        overflow: 'hidden'
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

    imagenProducto: {
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
});