import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, RefreshControl, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default (props) => {
    const [productos, setProductos] = useState([]);
    const [options, setOptions] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [connectionState, setConnectionState] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        verifyConnection();
    }, []);
    async function verifyConnection() {

        NetInfo.addEventListener(state => {
            setConnectionState(state.isConnected);
            if (state.isConnected) {
                fetchOptionsFromAPI();
                fetchLocationsFromAPI();
                fetchUsuariosFromAPI();
            } else {
                fetchLocalOptionsFromAPI();
                fetchLocalData();
                fetchLocalUsuarios();
            }
        });
    }
    async function fetchLocalData() {
        const storedData = await AsyncStorage.getItem('productos');
        if (storedData) {
            setProductos(JSON.parse(storedData));
        }
    }
    const fetchUsuariosFromAPI = async () => {
        try {
            // Realizar la solicitud HTTP para obtener las opciones desde la API
            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_usuarios');
            const data = await response.json();
            data.unshift({ id: 0, nombres: "TODOS" });
            setUsuarios(data);
            await AsyncStorage.setItem('usuarios', JSON.stringify(data));
        } catch (error) {
            console.error('Error al obtener usuarios desde la API:', error);
            const storedUsuarios = await AsyncStorage.getItem('usuarios');
            if (storedUsuarios) {
                storedUsuarios.unshift({ id: 0, sede: "TODAS" });
                setUsuarios(JSON.parse(storedUsuarios));
            }
        }
    };
    async function fetchLocalUsuarios() {
        const storedUsuarios = await AsyncStorage.getItem('usuarios');
        if (storedUsuarios) {
            const parsedUsuarios = JSON.parse(storedUsuarios);
            parsedUsuarios.unshift({ id: 0, nombres: "TODOS" });
            setUsuarios(parsedUsuarios);
        }
    }
    async function fetchLocationsFromAPI() {
        console.log("DEVUELVO YA");
        const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'uploads');
        if (!directoryInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'uploads', { intermediates: true });
        }

        try {
            Alert.alert(
                'Mensaje',
                'Sincronizando Productos.',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                { cancelable: false }
            );
            const storedProductos = await AsyncStorage.getItem('productos');
            const parsedProductos = JSON.parse(storedProductos);

            // Iterar sobre cada elemento del productList
            for (const producto of parsedProductos) {
                const formData = new FormData(); // Crear un nuevo FormData para cada producto

                // Iterar sobre cada campo del producto y agregarlo al FormData
                for (const key in producto) {
                    if (key === 'photo' && producto[key] instanceof Object) {
                        // Si el campo es una imagen, agregarla al FormData con el nombre 'photo'
                        formData.append('photo', {
                            uri: producto[key].uri,
                            name: producto[key].name,
                            type: 'image/jpeg',
                        });
                    } else {
                        // Si el campo no es una imagen, agregarlo al FormData con su clave correspondiente
                        formData.append(key, producto[key]);
                    }
                }
                fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=sincronizar_inventario', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json() /*{
                        //response.json()
                        console.log(response.json());
                    }*/)
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => console.error(`Error al enviar elemento:`, error));
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
        try {
            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_inventario');
            const data = await response.json();
            const inventarios = data;

            for (const inventario of inventarios) {
                const fotoExists = await checkFileExists(inventario.foto);
                if (!fotoExists) {
                    await downloadImage(inventario.foto);
                }
            }
            setProductos(inventarios);
            setFilteredProductos(inventarios);

            await AsyncStorage.setItem('productos', JSON.stringify(inventarios));
        } catch (error) {
            console.error('Error al obtener datos de la API AKI:', error);
            const storedData = await AsyncStorage.getItem('productos');
            if (storedData) {
                setProductos(JSON.parse(storedData));
                setFilteredProductos(JSON.parse(storedData));
            }
        }
    }
    const fetchOptionsFromAPI = async () => {
        try {
            // Realizar la solicitud HTTP para obtener las opciones desde la API
            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_sedes');
            const data = await response.json();
            data.unshift({ id: 0, sede: "TODAS" });
            setOptions(data);
            await AsyncStorage.setItem('sedes', JSON.stringify(data));
        } catch (error) {
            const storedOptions = await AsyncStorage.getItem('sedes');
            console.log("SEDES DEL LOCAL");
            console.log(storedOptions);
            if (storedOptions) {
                storedOptions.unshift({ id: 0, sede: "TODAS" });
                setOptions(JSON.parse(storedOptions));
            }
            console.error('Error al obtener opciones desde la API:', error);
        }
    };

    async function fetchLocalOptionsFromAPI() {
        const storedOptions = await AsyncStorage.getItem('sedes');
        if (storedOptions) {
            const parsedOptions = JSON.parse(storedOptions);
            parsedOptions.unshift({ id: 0, sede: "TODAS" });
            setOptions(parsedOptions);
        }
    }
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            verifyConnection();
            setIsRefreshing(false);
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            setIsRefreshing(false);
        }
    }
    const fetchEmplazamientosFromAPI = async (id_sede) => {
        try {
            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_emplazamientos');
            const data = await response.json();
            data.unshift({ id: 0, emplazamiento: "TODAS", id_sede: id_sede });
            await AsyncStorage.setItem('emplazamientos', JSON.stringify(data));

            setEmplazamientos(data.filter(item => item.id_sede == id_sede));
        } catch (error) {
            console.error('Error al obtener emplazamientos desde la API:', error);
            const storedEmplazamientos = await AsyncStorage.getItem('emplazamientos');
            if (storedEmplazamientos) {
                const parsedEmplazamientos = JSON.parse(storedEmplazamientos);
                parsedEmplazamientos.unshift({ id: 0, emplazamiento: "TODAS", id_sede: id_sede });
                setEmplazamientos(parsedEmplazamientos.filter(item => item.id_sede == id_sede));
            }
        }
    };

    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await AsyncStorage.getItem('emplazamientos');
        if (storedEmplazamientos) {
            const parsedEmplazamientos = JSON.parse(storedEmplazamientos);
            parsedEmplazamientos.unshift({ id: 0, emplazamiento: "TODAS", id_sede: id_sede });
            setEmplazamientos(parsedEmplazamientos.filter(item => item.is_sede == id_sede));
        }
    }
    const { navigate } = props.navigation;
    const handleOptionChange = (value) => {
        setSelectedOption(value);
        if (value > 0) {
            if (selectedUsuario > 0) {
                const prev = productos.filter(producto => producto.id_usuario == selectedUsuario);
                setFilteredProductos(prev.filter(producto =>
                    producto.id_sede == value
                ));
            } else {
                const productosFiltrados = productos.filter(producto =>
                    producto.id_sede == value
                );
                setFilteredProductos(productosFiltrados);
            }
            if (connectionState) {
                fetchEmplazamientosFromAPI(value);
            } else {
                fetchLocalEmplazamientosFromAPI(value);
            }
            setVisible(true);
        } else {
            if (selectedUsuario > 0) {
                setFilteredProductos(productos.filter(producto => producto.id_usuario == selectedUsuario));
            } else {
                setVisible(false);
                setFilteredProductos(productos);
            }
        }
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);

        if (value > 0) {
            const productosFiltrados = filteredProductos.filter(producto => producto.id_emplazamiento == value);
            setFilteredProductos(productosFiltrados);
        } else {
            if (selectedUsuario > 0) {
                setFilteredProductos(productos.filter(producto =>
                    producto.id_usuario == selectedUsuario && producto.id_sede == selectedOption
                ));
            } else {
                setFilteredProductos(productos.filter(producto =>
                    producto.id_sede == selectedOption
                ));
            }
        }
    }
    const handleUsuarioChange = (value) => {
        setSelectedUsuario(value);
        if (value > 0) {
            if (selectedOption > 0) {
                const productosFiltrados = filteredProductos.filter(producto => producto.id_usuario == value);
                setFilteredProductos(productosFiltrados);
            } else {
                const productosFiltrados = productos.filter(producto => producto.id_usuario == value);
                setFilteredProductos(productosFiltrados);
            }
        } else {
            if (selectedOption > 0) {
                if (selectedEmplazamiento > 0) {
                    const prev = productos.filter(producto =>
                        producto.id_sede == selectedOption
                    );
                    setFilteredProductos(prev.filter(
                        producto => producto.id_emplazamiento == selectedEmplazamiento
                    ));
                } else {
                    setFilteredProductos(productos.filter(producto =>
                        producto.id_sede == selectedOption
                    ));
                }
            } else {
                setFilteredProductos(productos);
            }
        }
    }
    const downloadImage = async (foto) => {
        if (foto && foto != "null") {
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
        const fileUri = FileSystem.documentDirectory + 'uploads/' + foto;
        try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            return fileInfo.exists;
        } catch (error) {
            console.error('Error al verificar si el archivo existe:', error);
            return false;
        }
    };

    const filtrarProductos = (text) => {
        // Filtrar productos basados en el texto de búsqueda
        if (text) {
            const productosFiltrados = filteredProductos.filter(producto =>
                producto.descripcion.toLowerCase().includes(text.toLowerCase()) || producto.codigo_af.toLowerCase().includes(text.toLowerCase()) || producto.codigo_fisico.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProductos(productosFiltrados);
        } else {
            setFilteredProductos(productos);
        }
    }

    return (
        <View style={styles.viewStyle}>
            <View style={styles.encabezado}>
                <View style={styles.contenedorTexto}>
                    <Text style={styles.textotitulo1}>Listado de Productos</Text>
                </View>
                <View style={styles.textoinfo2}>
                    <View style={styles.action}>
                        <Picker
                            selectedValue={selectedOption}
                            onValueChange={handleOptionChange}
                            style={[styles.textInput2]}
                        >
                            {options.map((option) => (
                                <Picker.Item style={{ fontSize: 12 }} key={option.id} label={option.sede} value={option.id} />
                            ))}
                        </Picker>
                    </View>
                    <View style={[styles.action, { display: isVisible ? 'flex' : 'none' }]} >
                        <Picker
                            selectedValue={selectedEmplazamiento}
                            onValueChange={handleEmplazamientoChange}
                            style={styles.textInput}
                        >
                            {emplazamientos.map((emplazamiento) => (
                                <Picker.Item style={{ fontSize: 12 }} key={emplazamiento.id} label={emplazamiento.emplazamiento} value={emplazamiento.id} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.action}>
                        <Picker
                            selectedValue={selectedUsuario}
                            onValueChange={handleUsuarioChange}
                            style={styles.textInput}
                        >
                            {usuarios.map((usuario) => (
                                <Picker.Item style={{ fontSize: 12 }} key={usuario.id} label={usuario.nombres} value={usuario.id} />
                            ))}
                        </Picker>
                    </View>
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
                    <View style={styles.iconocirculobusca}>
                        <MaterialIcons name='add' style={styles.iconosbusca} onPress={() => navigate('InformacionProducto', {
                            id: -1
                        })} />
                    </View>
                </View>
                <ScrollView style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                        />
                    }>
                    {filteredProductos.map((producto, index) => (
                        <Pressable
                            key={index}
                            onPress={() => navigate('InformacionProducto', {
                                id: producto.id < -1 ? producto.id_local : producto.id
                            })}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.containerinfo}>
                                <View style={styles.contenedorTexto}>
                                    <View style={styles.iconocirculo}>
                                        <Image style={styles.imagenProducto} source={{ uri: FileSystem.documentDirectory + 'uploads/' + producto.foto }} />
                                    </View>
                                    <View style={styles.textoinfo}>
                                        <Text style={styles.texto1}>{producto.descripcion}</Text>
                                        {producto.nombres != null ? <Text style={styles.texto2}>{producto.nombres}</Text> : null}
                                        <Text style={styles.texto2}>{producto.sede}</Text>
                                        <Text style={styles.texto2}>{producto.emplazamiento}</Text>
                                    </View>
                                </View>
                                <View style={styles.textoinfo}>
                                    <Text style={[styles.texto1, styles.textoDerecha]}>{producto.cuenta}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.codigo_af}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.codigo_fisico}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    contenedorTexto: {
        flex: 1,
        flexDirection: 'row',
    },
    textoDerecha: {
        textAlign: 'right',
    },
    viewStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    /*----ESTILOS ENCABEZADO----*/
    encabezado: {
        padding: 10,
        flexDirection: 'row',
    },
    textotitulo1: {
        color: '#0000CC',
        fontSize: 20,
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
        fontSize: 12,
        fontWeight: 'bold',
    },
    texto2: {
        color: '#0000CC',
        fontSize: 11,
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
    textInput2: {
        paddingStart: 30,
        height: 40,
        fontSize: 11,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },
    textInput: {
        paddingStart: 30,
        height: 50,
        fontSize: 13,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',

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
        //paddingTop: 10,
    },
    textoinfo2: {
        paddingLeft: 20,
        width: '50%',
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