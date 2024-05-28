import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, RefreshControl, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import LoadingModal from './LoadingModal';
import { crearInventario, addInventario, addClasificacion, addEmplazamiento, addEstado, addSede, addUsuario, crearClasificacion, crearEmplazamiento, crearEstado, crearSedes, crearUsuario, getCountInventario, getAllInventario, getCountUsuarios, getCountEmplazamiento, getCountSedes, getCountClasificacion, getCountEstado, getAllUsuarios, getAllSedes, getAllEmplazamientos, getEmplazamientoByIdSede, getInventarioById, getCountInventarioById, getAllInventarioFechaModificacion } from "./db";

export default (props) => {
    const [productos, setProductos] = useState([]);
    const [options, setSedes] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [connectionState, setConnectionState] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [isVisibleUsuarios, setVisibleUsuarios] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        verifyConnection();
    }, []);
    async function verifyConnection() {
        crearInventario();
        crearSedes();
        crearEmplazamiento();
        crearUsuario();
        crearEstado();
        crearClasificacion();
        NetInfo.addEventListener(state => {
            //state.isConnected
            setConnectionState(state.isConnected);
            if (state.isConnected) {
                fetchSedesFromAPI();
                fetchInventarioFromAPI();
            } else {
                fetchLocalSedes();
                fetchLocalInventario();
            }
        });
    }
    async function fetchLocalInventario() {
        console.log("Sin internet");
        await AsyncStorage.setItem('estadoConexionAnterior', '0');

        let productos = await getAllInventario();
        setProductos(productos);
    }
    const fetchUsuariosFromAPI = async (id_emplazamiento) => {
        try {
            const storedUsuarios = await getAllUsuarios();//await AsyncStorage.getItem('usuarios');
            //const parsedUsuarios = JSON.parse(storedUsuarios);
            if (storedUsuarios && storedUsuarios.length > 0) {
                const check = storedUsuarios.filter(item => item.id == 0 && item.id_emplazamiento == id_emplazamiento);
                if (check.length == 0) {
                    storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
                }
                const usuariosFiltrados = storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento);
                setUsuarios(usuariosFiltrados);
            } else {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_usuarios_emplazamiento');
                const data = await response.json();
                const dataFiltered = data.filter(item => item.id_emplazamiento == id_emplazamiento);

                let flag = 0;
                if (data.length > await getCountUsuarios()) {
                    flag = 1;
                }
                for (const usuario of data) {
                    if (flag == 1) {
                        await addUsuario(
                            [
                                usuario.id,
                                null,
                                usuario.nombres,
                                null,
                                null,
                                null,
                                null,
                                null,
                                usuario.id_emplazamiento
                            ]);
                    }
                }

                const storedUsuarios = await getAllUsuarios();
                dataFiltered.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
                setUsuarios(storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento));

            }
        } catch (error) {
            console.error('Error al obtener usuarios desde la API:', error);
        }
    };
    async function fetchLocalUsuarios(id_emplazamiento) {
        //const storedUsuarios = await AsyncStorage.getItem('usuarios');
        const storedUsuarios = await getAllUsuarios();
        if (storedUsuarios) {
            //const parsedUsuarios = JSON.parse(storedUsuarios);
            storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
            setUsuarios(storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento));
        }
    }
    async function fetchInventarioFromAPI() {
        setLoading(true);
        const estadoConexionAnterior = await AsyncStorage.getItem('estadoConexionAnterior');
        await AsyncStorage.setItem('estadoConexionAnterior', '1');
        var inventarios = [];
        const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'uploads');
        if (!directoryInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'uploads', { intermediates: true });
        }
        try {
            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_inventario');
            const data = await response.json();
            inventarios = data;
            let flag = 0;
            if (data.length >= await getCountInventario()) {
                flag = 1;
            }
            setProductos(inventarios);
            for (const inventario of inventarios) {
                const fotoExists = await checkFileExists(inventario.foto);
                if (!fotoExists) {
                    await downloadImage(inventario.foto);
                }
                if (flag == 1) {
                    if (await getCountInventarioById(inventario.id) == 0) {
                        await addInventario(
                            [
                                inventario.id,
                                inventario.cuenta,
                                inventario.id_sede,
                                inventario.codigo_af,
                                inventario.sap_padre,
                                inventario.sap_comp,
                                inventario.codigo_fisico,
                                inventario.descripcion,
                                inventario.marca,
                                inventario.modelo,
                                inventario.serie,
                                inventario.medida,
                                inventario.color,
                                inventario.detalles,
                                inventario.observaciones,
                                inventario.otros,
                                inventario.id_usuario,
                                inventario.inventariador,
                                inventario.id_clasificacion,
                                inventario.id_estado,
                                inventario.usuario_creacion,
                                inventario.fecha_creacion,
                                inventario.foto,
                                inventario.id_emplazamiento,
                                inventario.cantidad,
                                inventario.unidad,
                                null
                            ]
                        );
                    }
                }
            }

            console.log("SI TRAJE");
        } catch (error) {
            console.error('Error al obtener datos de la API AKI:', error);
            const storedData = await AsyncStorage.getItem('productos');
            if (storedData) {
                setProductos(JSON.parse(storedData));
            }
        }
        try {
            if (estadoConexionAnterior == '0') {
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
                //const storedProductos = await AsyncStorage.getItem('productos');
                const parsedProductos = await getAllInventarioFechaModificacion(); //JSON.parse(storedProductos);
                console.log(parsedProductos);
                // Iterar sobre cada elemento del productList
                for (const producto of parsedProductos) {
                    if (!producto.fecha_modificacion == "") {
                        const formData = new FormData(); // Crear un nuevo FormData para cada producto
                        // Iterar sobre cada campo del producto y agregarlo al FormData
                        for (const key in producto) {
                            if (key === 'foto' && producto[key] != null) {
                                // Si el campo es una imagen, agregarla al FormData con el nombre 'photo'
                                formData.append('photo', {
                                    uri: FileSystem.documentDirectory + 'uploads/' + producto[key],
                                    name: producto[key],
                                    type: 'image/jpeg',
                                });
                                formData.append(key, producto[key]);
                            } else {
                                // Si el campo no es una imagen, agregarlo al FormData con su clave correspondiente
                                formData.append(key, producto[key]);
                            }
                        }
                        fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=sincronizar_inventario', {
                            method: 'POST',
                            body: formData,
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => console.error(`Error al enviar elemento:`, error));
                    }
                }
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
        await AsyncStorage.setItem('productos', JSON.stringify(inventarios));
        setLoading(false);
    }
    const fetchSedesFromAPI = async () => {
        try {
            const parsedSedes = await getAllSedes();
            //const parsedSedes = JSON.parse(storedOptions);
            if (parsedSedes && parsedSedes.length > 0) {
                console.log("HAY SEDES EN SQLITE");
                const check = parsedSedes.filter(item => item.id == 0);
                if (check.length == 0) {
                    parsedSedes.unshift({ id: 0, sede: "--SELECCIONE--" });
                }
                setSedes(parsedSedes);
            } else {
                console.log("NO HAY SEDES EN SQLITE");
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_sedes');
                const data = await response.json();
                let flag = 0;
                if (data.length > await getCountSedes()) {
                    flag = 1;
                    console.log("HAY MAS SEDES EN DATA QUE SQLITE");
                }
                for (const sede of data) {
                    if (flag == 1) {
                        await addSede(
                            [
                                sede.id,
                                sede.codigo,
                                sede.sede,
                                sede.usuario_creacion,
                                sede.fecha_creacion
                            ]
                        );
                    }
                }
                data.unshift({ id: 0, sede: "--SELECCIONE--" });
                setSedes(data);
                //await AsyncStorage.setItem('sedes', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error al obtener opciones desde la API:', error);
        }
    };

    async function fetchLocalSedes() {
        const storedOptions = await getAllSedes();
        if (storedOptions) {
            //const parsedOptions = JSON.parse(storedOptions);
            storedOptions.unshift({ id: 0, sede: "--SELECCIONE--" });
            setSedes(storedOptions);
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
            const storedEmplazamientos = await getEmplazamientoByIdSede(id_sede);
            if (storedEmplazamientos && storedEmplazamientos.length > 0) {
                storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
                setEmplazamientos(storedEmplazamientos);
            } else {
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_emplazamientos');
                const data = await response.json();

                let flag = 0;
                if (data.length > await getCountEmplazamiento()) {
                    flag = 1;
                }
                for (const emplazamiento of data) {
                    if (flag == 1) {
                        await addEmplazamiento(
                            [
                                emplazamiento.id,
                                emplazamiento.id_sede,
                                emplazamiento.codigo,
                                emplazamiento.emplazamiento,
                                emplazamiento.usuario_creacion,
                                emplazamiento.fecha_creacion
                            ]
                        );
                    }
                }

                const storedEmplazamientos2 = await getEmplazamientoByIdSede(id_sede);
                storedEmplazamientos2.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
                setEmplazamientos(storedEmplazamientos2);
            }
        } catch (error) {
            console.error('Error al obtener emplazamientos desde la API:', error);
        }
    };

    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await getAllEmplazamientos();//await AsyncStorage.getItem('emplazamientos');
        if (storedEmplazamientos) {
            storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }
    const { navigate } = props.navigation;
    const handleSedeChange = (value) => {
        setLoading(true);
        setSelectedSede(value);
        if (value > 0) {
            if (connectionState) {
                fetchEmplazamientosFromAPI(value);
            } else {
                fetchLocalEmplazamientosFromAPI(value);
            }
            setVisible(true);
        } else {
            setFilteredProductos([]);
            setVisible(false);
            setVisibleUsuarios(false);
            setSelectedEmplazamiento(0);
        }
        setLoading(false);
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);
        setLoading(true);
        if (value > 0) {
            if (connectionState) {
                fetchUsuariosFromAPI(value);
            } else {
                fetchLocalUsuarios(value);
            }
            setVisibleUsuarios(true);
        } else {
            setFilteredProductos([]);
            setVisibleUsuarios(false);
            setSelectedUsuario(0);
        }
        setLoading(false);
    }
    const handleUsuarioChange = (value) => {
        setLoading(true);
        setSelectedUsuario(value);
        if (value > 0) {
            const productosFiltrados1 = productos.filter(
                producto => producto.id_sede == selectedSede
            );
            const productosFiltrados2 = productosFiltrados1.filter(
                producto => producto.id_emplazamiento == selectedEmplazamiento
            );
            const productosFiltrados3 = productosFiltrados2.filter(
                producto =>
                    producto.id_usuario == value
            );
            setFilteredProductos(productosFiltrados3);
        } else {
            setFilteredProductos([]);
        }
        setLoading(false);
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

    const filtrarProductos = async (text) => {
        // Filtrar productos basados en el texto de búsqueda
        if (text) {
            if (productos.length == 0) {
                console.log("Tomando productos desde Archivo");
                setProductos(data);
                await AsyncStorage.setItem('productos', JSON.stringify(data));
            }
            const productosFiltrados = productos.filter(producto =>
                (producto.descripcion.toLowerCase().includes(text.toLowerCase()) || producto.codigo_af.toLowerCase().includes(text.toLowerCase()) || producto.codigo_fisico.toLowerCase().includes(text.toLowerCase()) || producto.modelo.toLowerCase().includes(text.toLowerCase()) || producto.serie.toLowerCase().includes(text.toLowerCase())) && text.length >= 3
            );
            /*if (text.length >= 3) {
                const productosFiltrados = await getAllInventarioByText(text.toLowerCase());
                setFilteredProductos(productosFiltrados);
            }*/
            setFilteredProductos(productosFiltrados);
        } else {
            setFilteredProductos([]);
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
                            selectedValue={selectedSede}
                            onValueChange={handleSedeChange}
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
                    <View style={[styles.action, { display: isVisibleUsuarios ? 'flex' : 'none' }]}>
                        <Picker
                            selectedValue={selectedUsuario}
                            onValueChange={handleUsuarioChange}
                            style={styles.textInput}
                        >
                            {usuarios.map((usuario) => (
                                <Picker.Item style={{ fontSize: 12 }} key={usuario.id_remoto} label={usuario.nombres} value={usuario.id_remoto} />
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
                                        <Text style={styles.texto3}>{producto.clasificacion}</Text>
                                    </View>
                                </View>
                                <View style={styles.textoinfo}>
                                    <Text style={[styles.texto1, styles.textoDerecha]}>{producto.cuenta}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.codigo_af}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.codigo_fisico}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.modelo}</Text>
                                    <Text style={[styles.texto2, styles.textoDerecha]}>{producto.serie}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
                <LoadingModal visible={loading} />
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
    texto3: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold'
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