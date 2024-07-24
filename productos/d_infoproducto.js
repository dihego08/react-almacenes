import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import LoadingModal from './LoadingModal';
import ImageViewer from "./ImageViewer";
import * as ImageManipulator from 'expo-image-manipulator';
import {
    launchCameraAsync,
    useCameraPermissions,
    launchImageLibraryAsync,
    useMediaLibraryPermissions,
    PermissionStatus,
} from 'expo-image-picker';
import {
    addInventario, getAllSedes, getAllEmplazamientos, getAllEstado, getAllClasificacion, getInventarioById, updateInventario, getSedeByID, getEmplazamientoByID, getEstadoByID, getClasificacionByID, getUsuarioByIdIdEmplazamiento, getAllDistinctUsuarios, getAllClasificacionNuevo
} from "./db";

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
    const [selectedDetalle, setSelectedDetalle] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
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

    const [photoUri, setPhotoUri] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventariador, setInventariador] = useState(null);

    const [cameraPermissionInformation, requestPermission] =
        useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMediaLibraryPermission] = useMediaLibraryPermissions();

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
            await fetchLocalSedes();
            await fetchLocalEstado();
            if (props.navigation.state.params.id != -1) {
                await fetchLocalClasificacion(true);
                await getData();
            } else {
                await fetchLocalClasificacion(false);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const verifyMediaLibraryPermission = async () => {
        if (mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const responseStatus = await requestMediaLibraryPermission();
            return responseStatus.granted;
        }
        if (mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
            const permissionResponse = await requestMediaLibraryPermission();
            if (!permissionResponse.granted) {
                Alert.alert(
                    'Insufficient Media Library Permission!',
                    'This app needs media library permission'
                );
            }
            return permissionResponse.granted;
        }
        return true;
    };
    const verifyPermission = async () => {
        console.log('PermissionStatus.DENIED', PermissionStatus.DENIED);
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const responseStatus = await requestPermission();
            return responseStatus.granted;
        }
        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            const permissionResponse = await requestPermission();
            if (!permissionResponse.granted) {
                Alert.alert(
                    'Insufficient Camera Permission!',
                    'This app needs camera permission'
                );
            }
            return permissionResponse.granted;
        }
        //setShow(true);
        setPhotoUri(null);
        setFoto(null);
        return true;
    };
    const imagePickerHandler = async () => {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
            Alert.alert('Insufficient Camera Permission!', 'This app needs camera permission');
            return;
        }
        const image = await launchCameraAsync({
            allowsEditing: false,
            aspect: [16, 9],
            quality: 0.5,
        });

        if (!image.canceled) {
            const nombre_foto = await handlePhotoCapture(image.assets[0].uri);
            setFoto(nombre_foto);
            setPhotoUri(image.assets[0].uri);
        }
    };
    const selectImageHandler = async () => {
        const hasPermission = await verifyMediaLibraryPermission();
        if (!hasPermission) {
            return;
        }

        const image = await launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.5,
        });

        if (!image.canceled) {
            const nombre_foto = await handlePhotoCapture(image.assets[0].uri);
            setFoto(nombre_foto);
            setPhotoUri(image.assets[0].uri);
        }
    };
    const handleImagePress = (uri) => {
        setSelectedImageUri(uri);
        setIsImageViewerVisible(true);
    };
    async function fetchLocalSedes() {
        const storedOptions = await getAllSedes();
        if (storedOptions) {
            storedOptions.unshift({ id: 0, sede: "--SELECCIONE--", codigo: '000', usuario_creacion: null, fecha_creacion: null });
            setSedes(storedOptions);
        }
    }
    async function fetchLocalEstado() {
        const storedEstado = await getAllEstado();
        if (storedEstado) {
            storedEstado.unshift({ id: 0, estado: "--SELECCIONE--" });
            setEstados(storedEstado);
        }
    }
    async function fetchLocalClasificacion(type) {
        if (type) {
            const storedClasificacion = await getAllClasificacion();
            if (storedClasificacion) {
                storedClasificacion.unshift({ id: 0, clasificacion: "--SELECCIONE--" });
                setClasificacion(storedClasificacion);
            }
        } else {
            const storedClasificacion = await getAllClasificacionNuevo();
            if (storedClasificacion) {
                setClasificacion(storedClasificacion);
                setSelectedClasificacion(storedClasificacion[0].id);
            }
        }

    }
    async function getData() {
        try {
            let producto = await getInventarioById(props.navigation.state.params.id);//parsedProductos.filter(producto => producto.id == props.navigation.state.params.id);

            if (producto) {
                const la_sede = await getSedeByID(producto.id_sede);
                const el_emplazamiento = await getEmplazamientoByID(producto.id_emplazamiento);

                let id_remoto_usuario = 0;
                if (producto.id_usuario == null || producto.id_usuario == 0) {

                } else {
                    const el_usuario = await getUsuarioByIdIdEmplazamiento(el_emplazamiento.id, producto.id_usuario);
                    id_remoto_usuario = el_usuario.id_remoto;
                }

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
                setSelectedUsuario(id_remoto_usuario);
                handleUsuarioChange(id_remoto_usuario);
                if (producto.detalles == "" || producto.detalles == null) {
                    setSelectedDetalle(0);
                    handleDetalleChange(0);
                } else {
                    setSelectedDetalle(producto.detalles);
                    handleDetalleChange(producto.detalles);
                }

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
                //setDetalles(producto.detalles);
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
        } catch (error) {
            console.error('Error al obtener opciones desde la API:', error);
        }
    }
    async function fetchLocalUsuarios(id_emplazamiento) {
        const storedUsuarios = await getAllDistinctUsuarios();
        if (storedUsuarios) {
            storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
            setUsuarios(storedUsuarios);
        }
    }

    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await getAllEmplazamientos();
        if (storedEmplazamientos) {
            storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }

    const handleSedeChange = (value) => {
        if (value > 0) {
            setSelectedSede(value);
            fetchLocalEmplazamientosFromAPI(value);
        }
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);
        if (value > 0) {
            fetchLocalUsuarios(value);

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
    const handleDetalleChange = (value) => {
        setSelectedDetalle(value);
    }
    const handleUsuarioChange = (value) => {
        setSelectedUsuario(value);
    }
    const handlePhotoCapture = async (photoUri) => {
        try {
            // Ensure the 'uploads' directory exists
            const uploadsDir = FileSystem.documentDirectory + 'uploads/';
            const dirInfo = await FileSystem.getInfoAsync(uploadsDir);

            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(uploadsDir, { intermediates: true });
            }
            // Generate file name
            const fileName = Date.now() + 'I' + inventariador + '.jpg';
            const destinationPath = uploadsDir + fileName;

            const manipResult = await ImageManipulator.manipulateAsync(
                photoUri,
                [{ resize: { width: 800 } }], // Resize the image to a width of 800px, maintaining aspect ratio
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress the image to 70% quality
            );

            // Copy the file
            await FileSystem.copyAsync({
                from: manipResult.uri,
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
    const closeCamera = () => {
        setShow(false);
        setPhotoUri(null);
        setFoto(null);
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
    const uploadPhotoToServer = async () => {
        try {
            let fileName = null;
            if (photoUri) {
                fileName = foto;
            }
            if (descripcion == "" || descripcion == null) {
                Alert.alert(
                    'Alerta',
                    'Obligatorio: Descripción es necesario.',
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
            if ((selectedClasificacion == 1 || selectedClasificacion == 3) && ((fileName == null && (foto == "" || foto == null || foto == "null")) || selectedSede == 0
                || selectedEstado == 0
                || selectedClasificacion == 0
                || selectedEmplazamiento == 0 || selectedSede == ""
                || selectedEstado == ""
                || selectedClasificacion == ""
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
            if (selectedClasificacion == 0) {
                Alert.alert(
                    'Alerta',
                    'No se ha seleccionado una Clasificación.',
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

            const listaSedes = await getSedeByID(selectedSede);
            let nombreUsuario = '';
            let nombreEstado = '';
            if (selectedUsuario > 0) {
                const listaUsuario = await getUsuarioByIdIdEmplazamiento(selectedEmplazamiento, selectedUsuario);
                nombreUsuario = listaUsuario.nombres;
            }
            if (selectedEstado > 0) {
                const listaEstados = await getEstadoByID(selectedEstado);
                nombreEstado = listaEstados.estado;
            }
            const listaEmplazamientos = await getEmplazamientoByID(selectedEmplazamiento);
            const listaClasificacion = await getClasificacionByID(selectedClasificacion);

            if (id) {
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
                    selectedDetalle,
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
                    listaSedes.sede,
                    nombreUsuario,
                    listaEmplazamientos.emplazamiento,
                    listaClasificacion.clasificacion,
                    nombreEstado,
                    id
                ]);
                Alert.alert(
                    'Éxito',
                    'Actualizado Localmente',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                await addInventario(
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
                        selectedDetalle,
                        observaciones,
                        null,
                        selectedUsuario,
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
                        nombreUsuario,
                        listaEmplazamientos.emplazamiento,
                        listaClasificacion.clasificacion,
                        nombreEstado,
                        null,
                        '1'
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
                            >
                            </CameraView>
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='image' style={styles.iconos} onPress={takePicture} />
                            </View>
                        </View>
                        :
                        foto && !photoUri ?
                            <TouchableOpacity onPress={() => handleImagePress(FileSystem.documentDirectory + 'uploads/' + foto + '?rand=' + Math.random())}>
                                <Image style={{ width: 200, height: 200 }} source={{ uri: FileSystem.documentDirectory + 'uploads/' + foto + '?rand=' + Math.random() }} />
                            </TouchableOpacity> : ''
                    }

                    {photoUri && !show ? <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} /> : ''}
                    {!show ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='camera' style={styles.iconos} onPress={imagePickerHandler} />
                            </View>
                            <View style={styles.iconocirculo}>
                                <MaterialIcons name='image' style={styles.iconos} onPress={selectImageHandler} />
                            </View>
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
                <ImageViewer
                    isVisible={isImageViewerVisible}
                    onClose={() => setIsImageViewerVisible(false)}
                    imageUri={selectedImageUri}
                />
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
                            {/*<TextInput
                                placeholder="Detalles"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={detalles ? detalles : ''}
                                onChangeText={text => setDetalles(text)}
                            />*/}

                            <Picker
                                selectedValue={selectedDetalle}
                                onValueChange={handleDetalleChange}
                                style={styles.textInput}
                            >
                                <Picker.Item style={{ fontSize: 12 }} key='0' label='--DETALLE--' value='0' />
                                <Picker.Item style={{ fontSize: 12 }} key='OPERATIVO' label='OPERATIVO' value='OPERATIVO' />
                                <Picker.Item style={{ fontSize: 12 }} key='INOPERATIVO' label='INOPERATIVO' value='INOPERATIVO' />
                            </Picker>
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