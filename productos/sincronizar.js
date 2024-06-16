import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button, Dimensions, Pressable } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
const screenWidth = Dimensions.get('window').width;
import LoadingModal from './LoadingModal';
import { crearInventario, addInventario, addClasificacion, addEmplazamiento, addEstado, addSede, addUsuario, crearClasificacion, crearEmplazamiento, crearEstado, crearSedes, crearUsuario, getCountInventario, getAllInventario, getCountUsuarios, getCountEmplazamiento, getCountSedes, getCountClasificacion, getCountEstado, getAllUsuarios, getAllSedes, getAllEmplazamientos, getEmplazamientoByIdSede, getInventarioById, getCountInventarioById, getAllInventarioFechaModificacion, eliminarTablas, updateNuevo } from "./db";

export default () => {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(true);
    const crearTablas = async () => {
        await crearInventario();
        await crearSedes();
        await crearEmplazamiento();
        await crearUsuario();
        await crearEstado();
        await crearClasificacion();
    }
    const upload = async () => {
        setLoading(true);

        await crearTablas();

        const cantidadInventario = await getCountInventario();
        if (cantidadInventario > 0) {
            await enviarModificaciones();
        }

        setLoading(false);
        await mensajeExito('Subida Exitosa');
        setShow(false);
    }
    const showConfirmationAlert = async () => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas continuar?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Acción cancelada"),
                    style: "cancel"
                },
                { text: "Aceptar", onPress: () => download() }
            ],
            { cancelable: false }
        );
    }
    const download = async () => {
        try {
            setLoading(true);
            await crearTablas();
            await eliminarTablas();
            await crearTablas();

            await fetchUsuariosFromAPI();
            await fetchSedesFromAPI();
            await fetchInventarioFromAPI();
            await fetchClasificacion();
            await fetchEstado();
            await fetchEmplazamientosFromAPI();
            setLoading(false);
            await mensajeExito('Descarga Exitosa');
            setShow(true);
        } catch (error) {
            console.error('Error al verificar si el archivo existe:', error);
            Alert.alert(
                'Mensaje',
                message,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                { cancelable: false }
            );
            setLoading(false);
            return false;
        }
    }
    const mensajeExito = async (message) => {
        Alert.alert(
            'Mensaje',
            message,
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                },
            ],
            { cancelable: false }
        );
    }
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
    const fetchUsuariosFromAPI = async () => {
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_usuarios_emplazamiento');
            const data = await response.json();

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

        } catch (error) {
            console.error('Error al obtener usuarios desde la API:', error);
        }
    };
    const fetchEmplazamientosFromAPI = async () => {
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_emplazamientos');
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
        } catch (error) {
            console.error('Error al obtener emplazamientos desde la API:', error);
        }
    };
    async function enviarModificaciones() {
        try {
            const parsedProductos = await getAllInventarioFechaModificacion();
            console.log(parsedProductos);
            // Iterar sobre cada elemento del productList
            for (const producto of parsedProductos) {
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
                        console.log(producto[key]);
                        formData.append(key, producto[key]);
                    } else {
                        // Si el campo no es una imagen, agregarlo al FormData con su clave correspondiente
                        formData.append(key, producto[key]);
                    }
                }
                await fetch('https://inventarios.site/servicios/servicios.php?parAccion=sincronizar_inventario', {
                    method: 'POST',
                    body: formData,
                }).then(response => response.text())
                    .then(async data => {
                        console.log(data);
                        await updateNuevo(producto['id']);
                    })
                    .catch(error => console.error(`Error al enviar elemento:`, error));
            }

        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    }
    async function fetchInventarioFromAPI() {
        var inventarios = [];
        const directoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'uploads');
        if (!directoryInfo.exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'uploads', { intermediates: true });
        }
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_inventario');
            const data = await response.json();
            inventarios = data;
            let flag = 0;
            if (data.length >= await getCountInventario()) {
                flag = 1;
            }
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
                                inventario.sede,
                                inventario.nombres,
                                inventario.emplazamiento,
                                inventario.clasificacion,
                                inventario.estado,
                                null,
                                0
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error al obtener datos de la API AKI:', error);
        }

    }
    const fetchClasificacion = async () => {
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_clasificacion');
            const data = await response.json();

            let flag = 0;
            if (data.length > await getCountClasificacion()) {
                flag = 1;
            }

            for (const clasificacion of data) {
                if (flag == 1) {
                    await addClasificacion(
                        [
                            clasificacion.id,
                            clasificacion.clasificacion
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error al obtener clasificaciones desde la API:', error);
        }
    };

    const fetchEstado = async () => {
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_estados');
            const data = await response.json();

            let flag = 0;
            if (data.length > await getCountEstado()) {
                flag = 1;
            }

            for (const estado of data) {
                if (flag == 1) {
                    await addEstado(
                        [
                            estado.id,
                            estado.estado
                        ]
                    );
                }
            }
        } catch (error) {
            console.error('Error al obtener estados desde la API:', error);
        }
    };

    const downloadImage = async (foto) => {
        if (foto && foto != "null") {
            const uri = 'https://inventarios.site/servicios/uploads/' + foto;
            const fileUri = FileSystem.documentDirectory + 'uploads/' + foto;

            try {
                const { uri: downloadedImageUri } = await FileSystem.downloadAsync(uri, fileUri);
                console.log('Imagen descargada con éxito:', downloadedImageUri);
            } catch (error) {
                console.error('Error al descargar la imagen:', error);
            }
        }
    };
    const fetchSedesFromAPI = async () => {
        try {
            const response = await fetch('https://inventarios.site/servicios/servicios.php?parAccion=lista_sedes');
            const data = await response.json();
            let flag = 0;
            if (data.length > await getCountSedes()) {
                flag = 1;
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
        } catch (error) {
            console.error('Error al obtener opciones desde la API:', error);
        }
    };
    return (
        <View style={styles.viewStyle}>
            <View style={[styles.encabezado]}>
                <Pressable style={[styles.button]} onPress={upload} >
                    <MaterialIcons name='upload' style={styles.iconos} /><Text style={styles.text}>Subir Data</Text>
                </Pressable>
            </View>

            <View style={[styles.encabezado]}>
                <Pressable style={[styles.button, { backgroundColor: '#4590dc' }]} onPress={showConfirmationAlert} >
                    <MaterialIcons name='download' style={styles.iconos} /><Text style={styles.text}>Descargar Data</Text>
                </Pressable>
            </View>
            <LoadingModal visible={loading} />
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
        flexDirection: 'column',
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
    action2: {
        marginTop: 10,
        width: '49%',
        marginLeft: '1%'
    },
    action3: {
        marginTop: 10,
        width: '98%',
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
        fontSize: 60,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#fff',
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        flexDirection: 'row'
    },
    text: {
        fontSize: 20,
        lineHeight: 25,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    }
});