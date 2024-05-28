import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import LoadingModal from './LoadingModal';
import { crearInventario, addInventario, addClasificacion, addEmplazamiento, addEstado, addSede, addUsuario, crearClasificacion, crearEmplazamiento, crearEstado, crearSedes, crearUsuario, getCountInventario, getAllInventario, getCountUsuarios, getCountEmplazamiento, getCountSedes, getCountClasificacion, getCountEstado, getAllUsuarios, getAllSedes, getAllEmplazamientos, getAllEstado, getAllClasificacion, getInventarioById, getInventarioByIdLocal, updateInventario, getSedeByID, getEmplazamientoByID, getEstadoByID, getClasificacionByID, getUsuarioByIdIdEmplazamiento } from "./db";

export default (props) => {

    const [sedes, setSedes] = useState([]);
    const [estados, setEstados] = useState([]);
    const [clasificacion, setClasificacion] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [selectedClasificacion, setSelectedClasificacion] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const [cuenta, setCuenta] = useState(null);
    const [codigo_af, setCodigoAF] = useState(null);
    const [codigo_fisico, setCodigoFisico] = useState(null);
    const [descripcion, setDescripcion] = useState(null);
    const [marca, setMarca] = useState(null);
    const [modelo, setModelo] = useState(null);
    const [serie, setSerie] = useState(null);
    const [medida, setMedida] = useState(null);

    const [unidad, setUnidad] = useState(null);
    const [cantidad, setCantidad] = useState(null);
    const [color, setColor] = useState(null);
    const [detalles, setDetalles] = useState(null);
    const [observaciones, setObservaciones] = useState(null);
    const [id, setId] = useState(null);
    const [foto, setFoto] = useState(null);
    const [connectionState, setConnectionState] = useState(null);

    const [photoUri, setPhotoUri] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventariador, setInventariador] = useState(null);

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Función para cargar las opciones desde la API
        const unsubscribe = NetInfo.addEventListener(async state => {
            setLoading(true);
            AsyncStorage.getItem('usuarioLogin').then((storedData) => {
                const dataLogin = JSON.parse(storedData);
                setInventariador(dataLogin.id);
            }).catch((error) => {
                console.error('Error al obtener datos del usuario:', error);
            });
            //state.isConnected

            setConnectionState(state.isConnected);
            if (state.isConnected) {
                fetchSedesFromAPI();
                fetchEstado();
                fetchClasificacion();
                if (props.navigation.state.params.id != -1) {
                    getData(true);
                }
            } else {
                fetchLocalSedes();
                fetchLocalEstado();
                fetchLocalClasificacion();
                if (props.navigation.state.params.id != -1) {
                    getData(false);
                }
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const fetchClasificacion = async () => {
        try {
            const parsedClasificacion = await getAllClasificacion();
            if (parsedClasificacion && parsedClasificacion.length > 0) {
                const check = parsedClasificacion.filter(item => item.id == 0);
                if (check.length == 0) {
                    parsedClasificacion.unshift({ id: 0, clasificacion: "--SELECCIONE--" });
                }
                setClasificacion(parsedClasificacion);
            } else {
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_clasificacion');
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

                data.unshift({ id: 0, clasificacion: "--SELECCIONE--" });
                setClasificacion(data);
            }
        } catch (error) {
            console.error('Error al obtener clasificaciones desde la API:', error);
        }
    };

    const fetchEstado = async () => {
        try {
            const parsedEstado = await getAllEstado();
            //const parsedEstado = JSON.parse(storedOptions);
            if (parsedEstado && parsedEstado.length > 0) {
                const check = parsedEstado.filter(item => item.id == 0);
                if (check.length == 0) {
                    parsedEstado.unshift({ id: 0, estado: "--SELECCIONE--" });
                }
                setEstados(parsedEstado);
            } else {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_estados');
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

                data.unshift({ id: 0, estado: "--SELECCIONE--" });
                setEstados(data);
            }
        } catch (error) {
            console.error('Error al obtener estados desde la API:', error);
        }
    };
    const fetchSedesFromAPI = async () => {
        try {
            const storedOptions = await getAllSedes();
            if (storedOptions && storedOptions.length > 0) {
                storedOptions.unshift({ id: 0, sede: "--SELECCIONE--", codigo: '000', usuario_creacion: null, fecha_creacion: null });
                setSedes(storedOptions);
            }
        } catch (error) {
            console.error('Error al obtener sedes desde la API:', error);
        }
    };
    async function fetchLocalSedes() {
        const storedOptions = await getAllSedes();//await AsyncStorage.getItem('sedes');
        if (storedOptions) {
            storedOptions.unshift({ id: 0, sede: "--SELECCIONE--", codigo: '000', usuario_creacion: null, fecha_creacion: null });
            setSedes(storedOptions);
        }
    }
    async function fetchLocalEstado() {
        const storedEstado = await getAllEstado();//await AsyncStorage.getItem('estados');
        if (storedEstado) {
            storedEstado.unshift({ id: 0, estado: "--SELECCIONE--" });
            setEstados(storedEstado);
        }
    }
    async function fetchLocalClasificacion() {
        const storedClasificacion = await getAllClasificacion();//await AsyncStorage.getItem('clasificacion');
        if (storedClasificacion) {
            storedClasificacion.unshift({ id: 0, clasificacion: "--SELECCIONE--" });
            setClasificacion(storedClasificacion);
        }
    }
    async function getData(e) {
        try {
            //setLoading(true);
            if (e) {
                console.log("SI ES e");
                const formData = new FormData();
                formData.append('id', props.navigation.state.params.id);
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=editar_inventario', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const result = await response.json();
                const la_sede = await getSedeByID(result.id_sede);
                const el_emplazamiento = await getEmplazamientoByID(result.id_emplazamiento);

                setSelectedSede(la_sede.id);
                if (result.id_estado == 0 || result.id_estado == '' || result.id_estado == null || result.id_estado == 'null') {
                    setSelectedEstado(0);
                } else {
                    const el_estado = await getEstadoByID(result.id_estado);
                    setSelectedEstado(el_estado.id);
                    handleEstadoChange(el_estado.id);
                }
                if (result.id_clasificacion == 0 || result.id_clasificacion == '' || result.id_clasificacion == null || result.id_clasificacion == 'null') {
                    setSelectedClasificacion(0);
                } else {
                    const la_clasificacion = await getClasificacionByID(result.id_clasificacion);
                    setSelectedClasificacion(la_clasificacion.id);
                    handleClasificacionChange(la_clasificacion.id);
                }

                setId(result.id);
                setCuenta(result.cuenta);
                setCodigoAF(result.codigo_af);
                setCodigoFisico(result.codigo_fisico);
                setDescripcion(result.descripcion);
                setMarca(result.marca);
                setModelo(result.modelo);
                setSerie(result.serie);
                setMedida(result.medida);
                setUnidad(result.unidad);
                setCantidad(result.cantidad);
                setColor(result.color);
                setDetalles(result.detalles);
                setObservaciones(result.observaciones);
                setFoto(result.foto);

                handleSedeChange(la_sede.id);
                setSelectedEmplazamiento(el_emplazamiento.id);
                handleEmplazamientoChange(el_emplazamiento.id);
                setSelectedUsuario(result.id_usuario);
            } else {
                let producto = [];
                if (props.navigation.state.params.id < -1) {
                    producto = await getInventarioByIdLocal(props.navigation.state.params.id);//parsedProductos.filter(producto => producto.id_local == props.navigation.state.params.id);
                } else {
                    producto = await getInventarioById(props.navigation.state.params.id);//parsedProductos.filter(producto => producto.id == props.navigation.state.params.id);
                }
                if (producto) {
                    const id_sede = producto.id_sede;

                    const la_sede = await getSedeByID(producto.id_sede);
                    const el_emplazamiento = await getEmplazamientoByID(producto.id_emplazamiento);
                    const el_usuario = await getUsuarioByIdIdEmplazamiento(el_emplazamiento.id, producto.id_usuario);
                    if (producto.id_estado == 0 || producto.id_estado == '' || producto.id_estado == null || producto.id_estado == 'null') {
                        setSelectedEstado(0);
                    } else {
                        const el_estado = await getEstadoByID(producto.id_estado);
                        setSelectedEstado(el_estado.id);
                        handleEstadoChange(el_estado.id);
                    }
                    if (producto.id_clasificacion == 0 || producto.id_clasificacion == '' || producto.id_clasificacion == null || producto.id_clasificacion == 'null') {
                        setSelectedClasificacion(0);
                    } else {
                        const la_clasificacion = await getClasificacionByID(producto.id_clasificacion);
                        setSelectedClasificacion(la_clasificacion.id);
                        handleClasificacionChange(la_clasificacion.id);
                    }

                    setSelectedSede(la_sede.id);
                    handleSedeChange(la_sede.id);
                    setSelectedEmplazamiento(el_emplazamiento.id);
                    handleEmplazamientoChange(el_emplazamiento.id);
                    setSelectedUsuario(el_usuario.id_remoto);
                    handleUsuarioChange(el_usuario.id_remoto);

                    setId(producto.id);
                    setCuenta(producto.cuenta);
                    setCodigoAF(producto.codigo_af);
                    setCodigoFisico(producto.codigo_fisico);
                    setDescripcion(producto.descripcion);
                    setMarca(producto.marca);
                    setModelo(producto.modelo);
                    setSerie(producto.serie);
                    setMedida(producto.medida);
                    setUnidad(producto.unidad);
                    setCantidad(producto.cantidad);
                    setColor(producto.color);
                    setDetalles(producto.detalles);
                    setObservaciones(producto.observaciones);
                    setFoto(producto.foto);
                } else {
                    Alert.alert(
                        'Alerta',
                        'Producto no encontrado.',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                        { cancelable: false }
                    );
                }
            }
            //setLoading(false);
        } catch (error) {
            console.error('Error al obtener opciones desde la API:', error);
        }
    }
    async function fetchLocalUsuarios(id_emplazamiento) {
        const storedUsuarios = await getAllUsuarios();//await AsyncStorage.getItem('usuarios');
        if (storedUsuarios) {
            storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
            setUsuarios(storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento));
        }
    }
    const fetchUsuariosFromAPI = async (id_emplazamiento) => {
        try {
            const storedUsuarios = await getAllUsuarios();
            const check = storedUsuarios.filter(item => item.id == 0 && item.id_emplazamiento == id_emplazamiento);
            if (check.length == 0) {
                storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
            }
            setUsuarios(storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento));
        } catch (error) {
            console.error('Error al obtener usuarios desde la API:', error);
        }
    };
    const fetchEmplazamientosFromAPI = async (id_sede) => {
        try {
            const storedEmplazamientos = await getAllEmplazamientos();
            const check = storedEmplazamientos.filter(item => item.id == 0 && item.id_sede == id_sede);
            if (check.length == 0) {
                storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
            }
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        } catch (error) {
            console.error('Error al obtener emplazamientos desde la API:', error);
        }
    };

    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await getAllEmplazamientos();
        if (storedEmplazamientos) {
            storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }

    const handleSedeChange = (value) => {
        console.log("Sede => " + value);

        if (value > 0) {
            console.log("ENTRO AKI A CAMBIAR LA SEDE");
            setSelectedSede(value);
            if (connectionState) {
                fetchEmplazamientosFromAPI(value);
            } else {
                fetchLocalEmplazamientosFromAPI(value);
            }
        }
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);
        if (value > 0) {
            if (connectionState) {
                fetchUsuariosFromAPI(value);
            } else {
                fetchLocalUsuarios(value);
            }
        } else {
            setSelectedUsuario(0);
        }
    }
    const handleEstadoChange = (value) => {
        setSelectedEstado(value);
    };

    const handleClasificacionChange = (value) => {
        setSelectedClasificacion(value);
    };
    const handleUsuarioChange = (value) => {
        setSelectedUsuario(value);
    }
    const handlePhotoCapture = async (photoUri) => {
        try {
            // Ensure the 'uploads' directory exists
            const uploadsDir = FileSystem.documentDirectory + 'uploads/';
            const dirInfo = await FileSystem.getInfoAsync(uploadsDir);

            if (!dirInfo.exists) {
                console.log("Creating uploads directory");
                await FileSystem.makeDirectoryAsync(uploadsDir, { intermediates: true });
            }
            console.log("ID ====> " + id);
            // Generate file name
            const fileName = id + '.jpg';
            const destinationPath = uploadsDir + fileName;

            // Copy the file
            await FileSystem.copyAsync({
                from: photoUri,
                to: destinationPath
            });
            console.log("Photo copied successfully to:", destinationPath);
            return fileName;
        } catch (error) {
            console.error("Failed to capture image:", error);
        }
    };
    const takePicture = async () => {
        if (cameraRef) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === 'granted') {
                const photo = await cameraRef.takePictureAsync();
                let nombre_foto = await handlePhotoCapture(photo.uri);
                setFoto(nombre_foto);
                setPhotoUri(photo.uri);
                setShow(false);
            } else {
                console.error('Permission denied for camera');
            }
        }
    };
    const openCamera = async () => {
        setShow(true);
    }
    const closeCamera = () => {
        setShow(false);
        setPhotoUri(null);
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hora = '' + d.getHours(),
            minutos = '' + d.getMinutes(),
            segundos = '' + d.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-') + " " + [hora.padStart(2, "0"), minutos, segundos].join(':');
    }
    const renamePhoto = async (oldFileName, newFileName) => {
        try {
            const uploadsDir = FileSystem.documentDirectory + 'uploads/';

            // Define the full paths for the old and new file names
            const oldFilePath = uploadsDir + oldFileName;
            const newFilePath = uploadsDir + newFileName;

            // Use moveAsync to rename (move) the file
            await FileSystem.moveAsync({
                from: oldFilePath,
                to: newFilePath
            });

            console.log(`Photo renamed successfully from ${oldFileName} to ${newFileName}`);
        } catch (error) {
            console.error("Failed to rename the photo:", error);
        }
    };
    const uploadPhotoToServer = async () => {
        try {
            let fileName = null;
            if (photoUri) {
                fileName = 'photo_' + Date.now() + '.jpg';
            }
            if ((selectedClasificacion == 1 || selectedClasificacion == 3) && ((fileName == null && (foto == "" || foto == null || foto == "null")) || selectedSede == 0
                || selectedEstado == 0
                || selectedClasificacion == 0
                || selectedUsuario == 0
                || selectedEmplazamiento == 0 || selectedSede == ""
                || selectedEstado == ""
                || selectedClasificacion == ""
                || selectedUsuario == ""
                || selectedEmplazamiento == "")) {
                Alert.alert(
                    'Alerta',
                    'Obligatorio: Foto, Sede, Emplazamiento, Estado, Clasificación, Usuario',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }
            if (selectedClasificacion == 2 && fileName != null) {
                Alert.alert(
                    'Alerta',
                    'Producto NO UBICADO: No debería de tener foto.',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }

            const listaSedes = await getSedeByID(selectedSede); //sedes.filter(item => item.id == selectedSede);
            const listaUsuario = await getUsuarioByIdIdEmplazamiento(selectedEmplazamiento, selectedUsuario); //usuarios.filter(item => item.id == selectedUsuario);
            const listaEmplazamientos = await getEmplazamientoByID(selectedEmplazamiento); //emplazamientos.filter(item => item.id == selectedEmplazamiento);
            const listaClasificacion = await getClasificacionByID(selectedClasificacion); //clasificacion.filter(item => item.id == selectedClasificacion);
            const listaEstados = await getEstadoByID(selectedEstado); //estados.filter(item => item.id == selectedEstado);

            if (connectionState) {
                console.log("SI HAY INTERNET");
                const formData = new FormData();
                if (photoUri) {
                    formData.append('photo', {
                        uri: photoUri,
                        name: fileName,
                        type: 'image/jpeg',
                    });
                    formData.append("nombreFoto", fileName);
                }

                formData.append('id', id ? id : '');
                formData.append('cuenta', cuenta ? cuenta : '');
                formData.append('codigo_af', codigo_af ? codigo_af : '');
                formData.append('codigo_fisico', codigo_fisico ? codigo_fisico : '');
                formData.append('descripcion', descripcion ? descripcion : '');
                formData.append('marca', marca ? marca : '');
                formData.append('modelo', modelo ? modelo : '');
                formData.append('serie', serie ? serie : '');
                formData.append('medida', medida ? medida : '');
                formData.append('color', color ? color : '');
                formData.append('detalles', detalles ? detalles : '');
                formData.append('observaciones', observaciones ? observaciones : '');
                formData.append('id_sede', selectedSede);
                formData.append('id_estado', selectedEstado);
                formData.append('id_clasificacion', selectedClasificacion);
                formData.append('id_usuario', selectedUsuario);
                formData.append('id_emplazamiento', selectedEmplazamiento);
                formData.append('cantidad', cantidad);
                formData.append('inventariador', inventariador);
                formData.append('unidad', unidad);
                let url = '';
                if (id) {
                    url = 'https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=actualizar_inventario';
                    await updateInventario([
                        cuenta,
                        selectedSede,
                        codigo_af,
                        null,
                        null,
                        codigo_fisico,
                        descripcion,
                        marca,
                        modelo,
                        serie,
                        medida,
                        color,
                        detalles,
                        observaciones,
                        null,
                        selectedUsuario,
                        inventariador,
                        selectedClasificacion,
                        selectedEstado,
                        inventariador,
                        null,
                        foto,
                        null,
                        selectedEmplazamiento,
                        formatDate(Date.now()),
                        cantidad,
                        unidad,
                        id
                    ]);
                } else {
                    url = 'https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=insertar_inventario';
                }
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const result = await response.json();
                if (id) {

                } else {
                    await addInventario(
                        [
                            result.LID,
                            cuenta,
                            selectedSede,
                            codigo_af,
                            null,
                            null,
                            codigo_fisico,
                            descripcion,
                            marca,
                            modelo,
                            serie,
                            medida,
                            color,
                            detalles,
                            observaciones,
                            null,
                            inventariador,
                            selectedClasificacion,
                            selectedEstado,
                            inventariador,
                            formatDate(Date.now()),
                            foto,
                            selectedEmplazamiento,
                            cantidad,
                            unidad,
                            listaSedes.sede,
                            listaUsuario.nombres,
                            listaEmplazamientos.emplazamiento,
                            listaClasificacion.clasificacion,
                            listaEstados.estado,
                            null
                        ]
                    );
                }
                Alert.alert(
                    'Éxito',
                    'Guardado Correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
                console.log('Response from server:', result);
            } else {
                console.log("NO INTERNET");
                if (id) {
                    console.log("PODUCTO ENCONTRADO");
                    await updateInventario([
                        cuenta,
                        selectedSede,
                        codigo_af,
                        null,
                        null,
                        codigo_fisico,
                        descripcion,
                        marca,
                        modelo,
                        serie,
                        medida,
                        color,
                        detalles,
                        observaciones,
                        null,
                        selectedUsuario,
                        inventariador,
                        selectedClasificacion,
                        selectedEstado,
                        inventariador,
                        null,
                        foto,
                        null,
                        selectedEmplazamiento,
                        formatDate(Date.now()),
                        cantidad,
                        unidad,
                        id
                    ]);
                    Alert.alert(
                        'Éxito',
                        'Guardado Localmente',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    console.log("SIN ID");
                    const listaSedes = await getSedeByID(selectedSede);// sedes.filter(item => item.id == selectedSede);
                    const listaUsuario = await getUsuarioByIdIdEmplazamiento(selectedEmplazamiento, selectedUsuario); //usuarios.filter(item => item.id == selectedUsuario);
                    const listaEmplazamientos = await getEmplazamientoByID(selectedEmplazamiento);// emplazamientos.filter(item => item.id == selectedEmplazamiento);
                    const listaClasificacion = await getClasificacionByID(selectedClasificacion);// clasificacion.filter(item => item.id == selectedClasificacion);
                    console.log("si hay photouri");
                    const LID = await addInventario(
                        [
                            null,
                            cuenta,
                            selectedSede,
                            codigo_af,
                            null,
                            null,
                            codigo_fisico,
                            descripcion,
                            marca,
                            modelo,
                            serie,
                            medida,
                            color,
                            detalles,
                            observaciones,
                            null,
                            inventariador,
                            selectedClasificacion,
                            selectedEstado,
                            inventariador,
                            formatDate(Date.now()),
                            foto,
                            selectedEmplazamiento,
                            cantidad,
                            unidad,
                            listaSedes.sede,
                            listaUsuario.nombres,
                            listaEmplazamientos.emplazamiento,
                            listaClasificacion.clasificacion,
                            listaEstados.estado,
                            formatDate(Date.now())
                        ]);
                    await renamePhoto(foto, LID + '.jpg');
                    await updateInventario(
                        [
                            cuenta,
                            selectedSede,
                            codigo_af,
                            null,
                            null,
                            codigo_fisico,
                            descripcion,
                            marca,
                            modelo,
                            serie,
                            medida,
                            color,
                            detalles,
                            observaciones,
                            null,
                            selectedUsuario,
                            inventariador,
                            selectedClasificacion,
                            selectedEstado,
                            inventariador,
                            formatDate(Date.now()),
                            LID + '.jpg',
                            null,
                            selectedEmplazamiento,
                            formatDate(Date.now()),
                            cantidad,
                            unidad,
                            LID
                        ]
                    );
                    setProductos(productos);
                    Alert.alert(
                        'Éxito',
                        'Guardado Localmente',
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                        { cancelable: false }
                    );
                }
            }
        } catch (error) {
            Alert.alert(
                'ERROR',
                'Algo ha salido terriblemente mal',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                { cancelable: false }
            );
            console.error('Error uploading photo:', error);
        }
    };

    return (
        <View style={styles.viewStyle}>
            <View style={styles.encabezado}>
                <View>
                    <Text style={styles.textotitulo1}>Detalle Producto</Text>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.action}>
                    {show ?
                        <View style={[styles.action, { width: 200, height: 200 }]}>
                            <CameraView
                                ref={(ref) => {
                                    setCameraRef(ref);
                                }}
                                style={styles.camera}
                                ratio="4:3"
                            />
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='image' style={styles.iconos} onPress={takePicture} />
                            </View>
                        </View>
                        :
                        foto && !photoUri ?
                            <Image style={{ width: 200, height: 200 }} source={{ uri: FileSystem.documentDirectory + 'uploads/' + foto }} /> : ''

                    }

                    {photoUri && !show ? <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} /> : ''}
                    {!show ?
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='camera' style={styles.iconos} onPress={openCamera} />
                        </View> : ''
                    }
                    {show ?
                        <View style={styles.iconocirculo}>
                            <Pressable
                                onPress={closeCamera}
                            >
                                <MaterialIcons name='close' style={styles.iconos} />
                            </Pressable>
                        </View> : ''
                    }
                    <View style={styles.iconocirculo}>
                        <Pressable
                            onPress={uploadPhotoToServer}
                        >
                            <MaterialIcons name='check' style={styles.iconos} />
                        </Pressable>
                    </View>
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Cuenta:</Text>
                            <TextInput
                                placeholder="Cuenta"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={cuenta ? cuenta : ''}
                                onChangeText={text => setCuenta(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Sede:</Text>
                            <Picker
                                selectedValue={selectedSede}
                                onValueChange={handleSedeChange}
                                style={styles.textInput}
                            >
                                {sedes.map((option) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={option.id} label={option.sede} value={option.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Cantidad:</Text>
                            <TextInput
                                placeholder="Cantidad"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={cantidad ? cantidad : ''}
                                onChangeText={text => setCantidad(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Unidad:</Text>
                            <TextInput
                                placeholder="Unidad"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={unidad ? unidad : ''}
                                onChangeText={text => setUnidad(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Emplazamiento:</Text>
                            <Picker
                                selectedValue={selectedEmplazamiento}
                                onValueChange={handleEmplazamientoChange}
                                style={styles.textInput}
                            >
                                {emplazamientos.map((item) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={item.id} label={item.emplazamiento} value={item.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Código AF:</Text>
                            <TextInput
                                placeholder="Código AF"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={codigo_af ? codigo_af : ''}
                                onChangeText={text => setCodigoAF(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Código Físico:</Text>
                            <TextInput
                                placeholder="Código Físico"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={codigo_fisico ? codigo_fisico : ''}
                                onChangeText={text => setCodigoFisico(text)}
                            />
                        </View>
                    </View>

                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Estado:</Text>
                            <Picker
                                selectedValue={selectedEstado}
                                onValueChange={handleEstadoChange}
                                style={styles.textInput}
                            >
                                {estados.map((option) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={option.id} label={option.estado} value={option.id} />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Responsable:</Text>
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



                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Descripción:</Text>
                            <TextInput
                                placeholder="Descripción"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={descripcion ? descripcion : ''}
                                onChangeText={text => setDescripcion(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Marca:</Text>
                            <TextInput
                                placeholder="Marca"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={marca ? marca : ''}
                                onChangeText={text => setMarca(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Modelo:</Text>
                            <TextInput
                                placeholder="Modelo"
                                placeholderTextColor="#B2BABB"
                                value={modelo ? modelo : ''}
                                style={styles.textInput}
                                onChangeText={text => setModelo(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Serie:</Text>
                            <TextInput
                                placeholder="Serie"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={serie ? serie : ''}
                                onChangeText={text => setSerie(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Medida:</Text>
                            <TextInput
                                placeholder="Medida"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={medida ? medida : ''}
                                onChangeText={text => setMedida(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Color:</Text>
                            <TextInput
                                placeholder="Color"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={color ? color : ''}
                                onChangeText={text => setColor(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Clasificación:</Text>
                            <Picker
                                selectedValue={selectedClasificacion}
                                onValueChange={handleClasificacionChange}
                                style={styles.textInput}
                            >
                                {clasificacion.map((option) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={option.id} label={option.clasificacion} value={option.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Detalles:</Text>
                            <TextInput
                                placeholder="Detalles"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={detalles ? detalles : ''}
                                onChangeText={text => setDetalles(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Observaciones:</Text>
                            <TextInput
                                placeholder="Observaciones"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={observaciones ? observaciones : ''}
                                onChangeText={text => setObservaciones(text)}
                            />
                        </View>
                    </View>
                </ScrollView>
                <LoadingModal visible={loading} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    row: {
        flexDirection: 'row'
    },
    /*----ESTILOS ENCABEZADO----*/
    encabezado: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',

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
        marginLeft: 70,
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
        width: '98%',
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
    containerinfo: {
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 20,
        paddingTop: 0,
        margin: 8,
        elevation: 6,
    },
    iconocirculo: {
        height: 45,
        width: 45,
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    iconos: {
        fontSize: 25,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#0000CC',
    },

    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    contenedorfoto: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'center'
    },
    contenidoboton: {
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
    textInput: {
        paddingStart: 30,
        marginTop: 10,
        marginBottom: 10,
        height: 50,
        fontSize: 12,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },
    scrollView: {
        flex: 1,
    },
    camera: {
        flex: 1,
        height: 220,
        width: 180,
    },
    label: {
        color: '#0000CC',
    }
});