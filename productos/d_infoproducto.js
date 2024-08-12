import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, Alert, TouchableOpacity, Modal, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import LoadingModal from './LoadingModal';
import ImageViewer from "./ImageViewer";
import * as ImageManipulator from 'expo-image-manipulator';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
    launchCameraAsync,
    useCameraPermissions,
    launchImageLibraryAsync,
    useMediaLibraryPermissions,
    PermissionStatus,
} from 'expo-image-picker';
import {
    addInventario, getAllSedes, getAllAlmacenes, getAllEstado, getInventarioById, updateInventario, getSedeByID, getAlmacenByID, getEstadoByID, getUsuarioByIdIdEmplazamiento, getAllDistinctUsuarios, autocomplete, getFromControl, getMaterialById, buscarMedidor
} from "./db";

export default (props) => {

    const [sedes, setSedes] = useState([]);
    const [estados, setEstados] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [id_material, setIdMaterial] = useState(null);
    const [almacenes, setAlmacenes] = useState([]);
    const [selectedAlmacen, setSelectedEmplazamiento] = useState(null);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [conteo, setConteo] = useState(null);
    const [reconteo, setReconteo] = useState(null);
    const [reconteo2, setReconteo2] = useState(null);
    const [descripcion, setDescripcion] = useState(null);
    const [codigo, setCodigo] = useState(null);
    const [serie, setSerie] = useState(null);
    const [marca, setMarca] = useState(null);
    const [modelo, setModelo] = useState(null);

    const [unidad, setUnidad] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const [observaciones, setObservaciones] = useState(null);
    const [id, setId] = useState(null);
    const [foto, setFoto] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [codigo_inventario, setcodigoInventario] = useState(null);

    const [photoUri, setPhotoUri] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inventariador, setInventariador] = useState(null);

    const [cameraPermissionInformation, requestPermission] =
        useCameraPermissions();
    const [mediaLibraryPermissionInformation, requestMediaLibraryPermission] = useMediaLibraryPermissions();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
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
                await getData();
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
    const abrirModal = () => {
        setModalVisible(true); // Abre el modal cuando se presiona la imagen
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
    const handleCodigoChange = async (value) => {
        setCodigo(value);
        setQuery(value);
        if (value.length > 0) {
            let resultado = await autocompletar(value);
            setResults(resultado);
        } else {
            setResults([]);
        }
    }
    const buscarPorSerie = async (value) => {
        let resultado = await buscarMedidor(value);
        console.log(resultado);
        setDescripcion(resultado.material);
        setUnidad(resultado.unidad);
        setMarca(resultado.marca);
        setQuery(resultado.codigo);
        setCodigo(resultado.codigo);
        setModelo(resultado.modelo);
        setCantidad(resultado.cantidad);
        setIdMaterial(resultado.id_material);
        /*setSelectedSede(resultado.id_sede);
        handleSedeChange(resultado.id_sede);
        setSelectedEmplazamiento(resultado.id_almacen);
        handleAlmacenChange(resultado.id_almacen);*/
    }
    async function autocompletar(query) {
        return await autocomplete(query);
    }
    async function getData() {
        try {
            let producto = await getInventarioById(props.navigation.state.params.id);
            console.log(producto);

            if (producto) {
                const la_sede = await getSedeByID(producto.id_sede);
                const el_almacen = await getAlmacenByID(producto.id_almacen);
                const el_material = await getMaterialById(producto.id_material);
                console.log(el_material);
                const el_control = await getFromControl(producto.id_sede, producto.id_almacen, producto.id_material);

                if (producto.id_estado == 0 || producto.id_estado == '' || producto.id_estado == null || producto.id_estado == 'null') {
                    setSelectedEstado(0);
                } else {
                    const el_estado = await getEstadoByID(producto.id_estado);
                    setSelectedEstado(el_estado.id);
                    handleEstadoChange(el_estado.id);
                }

                setSelectedSede(la_sede.id);
                handleSedeChange(la_sede.id);
                setSelectedEmplazamiento(el_almacen.id);
                handleAlmacenChange(el_almacen.id);

                setId(producto.id);
                setCodigo(el_material.codigo);
                setQuery(el_material.codigo);
                setDescripcion(producto.material);
                setUnidad(el_material.unidad);
                if (el_control == null) {
                    setCantidad(0);
                } else {
                    setCantidad(el_control.cantidad);
                }
                setConteo(producto.conteo);
                setReconteo(producto.reconteo);
                setIdMaterial(el_material.id);
                setReconteo2(producto.reconteo2);
                setObservaciones(producto.observaciones);
                setUbicacion(producto.ubicacion);
                setcodigoInventario(producto.codigo_inventario);
                setFoto(producto.foto);
                setModelo(producto.modelo);
                setMarca(producto.marca);
                setSerie(producto.serie);
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

    async function fetchAlmacenes(id_sede) {
        const storedAlmacenes = await getAllAlmacenes();
        if (storedAlmacenes) {
            storedAlmacenes.unshift({ id: 0, almacen: "--SELECCIONE--", id_sede: id_sede });
            setAlmacenes(storedAlmacenes.filter(item => item.id_sede == id_sede));
        }
    }

    const handleSedeChange = async (value) => {
        if (value > 0) {
            setSelectedSede(value);
            fetchAlmacenes(value);
        }
    };
    const handleAlmacenChange = (value) => {
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
    const setValores = async (item) => {
        setDescripcion(item.material);
        setUnidad(item.unidad);
        setCodigo(item.codigo);
        setQuery(item.codigo);
        setIdMaterial(item.id);
        setResults([]);
        let control = await getFromControl(selectedSede, selectedAlmacen, item.id);
        if (control) {
            setCantidad(control.cantidad);
        } else {
            setCantidad(0);
        }
    }
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

            if ((selectedSede == 0
                || selectedEstado == 0
                || selectedAlmacen == 0 || selectedSede == ""
                || selectedEstado == ""
                || selectedAlmacen == "")) {
                Alert.alert(
                    'Alerta',
                    'Obligatorio:Sede, Almacen, Estado',
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
                const listaUsuario = await getUsuarioByIdIdEmplazamiento(selectedAlmacen, selectedUsuario);
                nombreUsuario = listaUsuario.nombres;
            }
            if (selectedEstado > 0) {
                const listaEstados = await getEstadoByID(selectedEstado);
                nombreEstado = listaEstados.estado;
            }
            const listaAlmacenes = await getAlmacenByID(selectedAlmacen);

            if (id) {
                await updateInventario([
                    selectedSede,
                    selectedAlmacen,
                    id_material,
                    conteo,
                    reconteo,
                    reconteo2,
                    ubicacion,
                    selectedEstado,
                    observaciones,
                    codigo_inventario,
                    foto,
                    formatDate(Date.now()),
                    inventariador,
                    'control',
                    listaSedes.sede,
                    nombreUsuario,
                    listaAlmacenes.almacen,
                    nombreEstado,
                    descripcion,
                    marca,
                    modelo,
                    serie,
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
                        selectedSede,
                        selectedAlmacen,
                        id_material,
                        conteo,
                        reconteo,
                        reconteo2,
                        ubicacion,
                        selectedEstado,
                        observaciones,
                        codigo_inventario,
                        foto,
                        formatDate(Date.now()),
                        inventariador,
                        'control',
                        listaSedes.sede,
                        nombreUsuario,
                        listaAlmacenes.almacen,
                        nombreEstado,
                        descripcion,
                        1,
                        marca,
                        modelo,
                        serie
                    ]
                );
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

                props.navigation.goBack();
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

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        //setQuery(data);
        setSerie(data);
        //handleCodigoChange(data);
        buscarPorSerie(data);
        setModalVisible(false);
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
                        <View style={styles.action2}>
                            <Text style={styles.label}>Almacén:</Text>
                            <Picker
                                selectedValue={selectedAlmacen}
                                onValueChange={handleAlmacenChange}
                                style={styles.textInput}
                            >
                                {almacenes.map((item) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={item.id} label={item.almacen} value={item.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.action}>

                        <View style={styles.action3}>
                            <Text style={styles.label}>Código Material:</Text>
                            <View style={styles.action}>
                                <TextInput
                                    placeholder="Código Material"
                                    placeholderTextColor="#B2BABB"
                                    style={[styles.textInput, { width: '100%' }]}
                                    value={query}
                                    onChangeText={handleCodigoChange}
                                />
                                <View style={styles.iconocirculobusca}>
                                    <Pressable
                                        onPress={abrirModal}
                                        style={({ pressed }) => {
                                            return { opacity: pressed ? 0 : 1 }
                                        }}>
                                        <Image style={styles.iconosbusca} resizeMode="contain" source={require('../assets/imgs/barcode.png')} />
                                    </Pressable>
                                </View>
                            </View>
                            <ScrollView style={styles.scrollView}>
                                {results.map(item => (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => setValores(item)}
                                        style={({ pressed }) => {
                                            return { opacity: pressed ? 0 : 1 }
                                        }}>
                                        <View key={item.id} style={styles.resultItem}>
                                            <Text><Text style={styles.bold}>{item.codigo}</Text> {item.material}</Text>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Descripción:</Text>
                            <TextInput
                                placeholder="Descripción"
                                placeholderTextColor="#B2BABB"
                                style={[styles.textInput, { color: "#000000", fontWeight: "bold" }]}
                                value={descripcion ? descripcion : ''}
                                editable={false}
                                onChangeText={text => setDescripcion(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Unidad:</Text>
                            <TextInput
                                placeholder="Unidad"
                                placeholderTextColor="#B2BABB"
                                style={[styles.textInput, { color: "#000000", fontWeight: "bold" }]}
                                value={unidad ? unidad : ''}
                                editable={false}
                                onChangeText={text => setUnidad(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Cantidad:</Text>
                            <TextInput
                                placeholder="Cantidad"
                                placeholderTextColor="#B2BABB"
                                style={[styles.textInput, { color: "#000000", fontWeight: "bold" }]}
                                value={cantidad ? cantidad : ''}
                                editable={false}
                                onChangeText={text => setCantidad(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Conteo:</Text>
                            <TextInput
                                placeholder="Conteo"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={conteo ? conteo : ''}
                                onChangeText={text => setConteo(text)}
                            />
                        </View>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Reconteo 1:</Text>
                            <TextInput
                                placeholder="Reconteo 1"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={reconteo ? reconteo : ''}
                                onChangeText={text => setReconteo(text)}
                            />
                        </View>
                    </View>

                    <View style={styles.action}>
                        <View style={styles.action2}>
                            <Text style={styles.label}>Reconteo 2:</Text>
                            <TextInput
                                placeholder="Reconteo 2"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={reconteo2 ? reconteo2 : ''}
                                onChangeText={text => setReconteo2(text)}
                            />
                        </View>
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
                    {/*<View style={styles.action}>
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
                    </View>*/}
                    {/*<View style={styles.action}>
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
                    </View>*/}
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Serie:</Text>
                            <TextInput
                                placeholder="Serie"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={serie ? serie : ''}
                                onChangeText={text => setSerie(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Ubicación:</Text>
                            <TextInput
                                placeholder="Ubicación"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={ubicacion ? ubicacion : ''}
                                onChangeText={text => setUbicacion(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.action}>
                        <View style={styles.action3}>
                            <Text style={styles.label}>Código Inventario:</Text>
                            <TextInput
                                placeholder="Código Inventario"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={codigo_inventario ? codigo_inventario : ''}
                                onChangeText={text => setcodigoInventario(text)}
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.cameraContainer}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={styles.camera2}
                        />
                        <Button title="Cerrar" style={styles.closeButton} onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        marginTop: 40,
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
    bold: {
        fontWeight: 'bold'
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
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    iconocirculobusca: {
        height: 30,
        width: 30,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 8,
        elevation: 10,
        padding: 5,
        marginLeft: 10,
        marginTop: 3,
    },
    iconosbusca: {
        padding: 5,
        marginRight: 3,
        width: '100%',
        height: '100%',
        color: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cameraContainer: {
        width: '90%',
        height: '90%',
        // backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    camera2: {
        width: '100%',
        height: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
    }
});