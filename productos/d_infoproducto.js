import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default (props) => {

    const [options, setOptions] = useState([]);
    const [estados, setEstados] = useState([]);
    const [clasificacion, setClasificacion] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
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
    const [cod_inventario, setCodInventario] = useState(null);
    const [id, setId] = useState(null);
    const [foto, setFoto] = useState(null);
    const [connectionState, setConnectionState] = useState(null);

    const [photoUri, setPhotoUri] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    const [show, setShow] = useState(false);

    useEffect(() => {
        // Función para cargar las opciones desde la API
        const fetchOptionsFromAPI = async () => {
            try {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_sedes');
                const data = await response.json();
                data.unshift({ id: 0, sede: "TODAS" });
                setOptions(data);
                await AsyncStorage.setItem('sedes', JSON.stringify(data));
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
                const storedOptions = await AsyncStorage.getItem('sedes');
                if (storedOptions) {
                    const parsedOptions = JSON.parse(storedOptions);
                    parsedOptions.unshift({ id: 0, sede: "TODAS" });
                    setOptions(parsedOptions);
                }
            }
        };

        const fetchClasificacion = async () => {
            try {
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_clasificacion');
                const data = await response.json();
                data.unshift({ id: 0, clasificacion: "TODAS" });
                setClasificacion(data);
                await AsyncStorage.setItem('clasificacion', JSON.stringify(data));
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
                const storedClasificacion = await AsyncStorage.getItem('clasificacion');
                if (storedClasificacion) {
                    const parsedClasificacion = JSON.parse(storedClasificacion);
                    parsedClasificacion.unshift({ id: 0, clasificacion: "TODAS" });
                    setClasificacion(parsedClasificacion);
                }
            }
        };

        const fetchEstado = async () => {
            try {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_estados');
                const data = await response.json();
                data.unshift({ id: 0, estado: "TODOS" });
                setEstados(data);
                await AsyncStorage.setItem('estados', JSON.stringify(data));
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
                const storedEstado = await AsyncStorage.getItem('estados');
                if (storedEstado) {
                    const parsedEstado = JSON.parse(storedEstado);
                    parsedEstado.unshift({ id: 0, estado: "TODOS" });
                    setEstados(parsedEstado);
                }
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
        async function fetchLocalEstado() {
            const storedEstado = await AsyncStorage.getItem('estados');
            if (storedEstado) {
                const parsedEstado = JSON.parse(storedEstado);
                parsedEstado.unshift({ id: 0, estado: "TODOS" });
                setEstados(parsedEstado);
            }
        }
        async function fetchLocalClasificacion() {
            const storedClasificacion = await AsyncStorage.getItem('clasificacion');
            if (storedClasificacion) {
                const parsedClasificacion = JSON.parse(storedClasificacion);
                parsedClasificacion.unshift({ id: 0, clasificacion: "TODAS" });
                setClasificacion(parsedClasificacion);
            }
        }
        async function fetchLocalUsuarios() {
            const storedUsuarios = await AsyncStorage.getItem('usuarios');
            if (storedUsuarios) {
                const parsedUsuarios = JSON.parse(storedUsuarios);
                parsedUsuarios.unshift({ id: 0, nombres: "TODOS" });
                setUsuarios(parsedUsuarios);
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
                    storedUsuarios.unshift({ id: 0, sede: "TODOS" });
                    setUsuarios(JSON.parse(storedUsuarios));
                }
            }
        };
        const unsubscribe = NetInfo.addEventListener(state => {
            //state.isConnected
            setConnectionState(state.isConnected);
            if (state.isConnected) {
                fetchOptionsFromAPI();
                fetchEstado();
                fetchClasificacion();
                fetchUsuariosFromAPI();
            } else {
                fetchLocalOptionsFromAPI();
                fetchLocalEstado();
                fetchLocalClasificacion();
                fetchLocalUsuarios();
            }
            if (props.navigation.state.params.id != -1) {
                getData(state.isConnected);
            }
        });
        return () => unsubscribe();

        async function getData(e) {
            try {
                if (e) {
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

                    setSelectedOption(result.id_sede);
                    if (result.id_sede > 0) {
                        fetchEmplazamientosFromAPI(result.id_sede);
                    }
                    setSelectedEmplazamiento(result.id_emplazamiento);
                    setSelectedEstado(result.id_estado);
                    setSelectedClasificacion(result.id_clasificacion);
                    setSelectedUsuario(result.id_usuario);
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
                    setCodInventario(result.cod_inventario);
                    setFoto(result.foto);
                } else {
                    const storedProductos = await AsyncStorage.getItem('productos');
                    if (storedProductos) {
                        let obj = JSON.parse(storedProductos);
                        let producto = [];
                        console.log(props.navigation.state.params.id);
                        if (props.navigation.state.params.id < -1) {
                            producto = obj.filter(producto => producto.id_local == props.navigation.state.params.id);
                        } else {
                            producto = obj.filter(producto => producto.id == props.navigation.state.params.id);
                        }
                        if (producto) {
                            setSelectedOption(producto[0].id_sede);
                            if (producto[0].id_sede > 0) {
                                fetchLocalEmplazamientosFromAPI(producto[0].id_sede);
                            }
                            setSelectedEmplazamiento(producto[0].id_emplazamiento);
                            setSelectedEstado(producto[0].id_estado);
                            setSelectedClasificacion(producto[0].id_clasificacion);
                            setSelectedUsuario(producto[0].id_usuario);
                            setId(producto[0].id);
                            setCuenta(producto[0].cuenta);
                            setCodigoAF(producto[0].codigo_af);
                            setCodigoFisico(producto[0].codigo_fisico);
                            setDescripcion(producto[0].descripcion);
                            setMarca(producto[0].marca);
                            setModelo(producto[0].modelo);
                            setSerie(producto[0].serie);
                            setMedida(producto[0].medida);
                            setUnidad(producto[0].unidad);
                            setCantidad(producto[0].cantidad);
                            setColor(producto[0].color);
                            setDetalles(producto[0].detalles);
                            setObservaciones(producto[0].observaciones);
                            setCodInventario(producto[0].cod_inventario);
                            setFoto(producto[0].foto);
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
                }
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
            }
        }
    }, []);

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
            setEmplazamientos(parsedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        if (connectionState) {
            fetchEmplazamientosFromAPI(value);
        } else {
            fetchLocalEmplazamientosFromAPI(value);
        }
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);
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
    const takePicture = async () => {
        if (cameraRef) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === 'granted') {
                const photo = await cameraRef.takePictureAsync();
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
    const uploadPhotoToServer = async () => {
        try {
            let fileName = null;
            if (photoUri) {
                fileName = 'photo_' + Date.now() + '.jpg';
                await FileSystem.copyAsync({
                    from: photoUri,
                    to: FileSystem.documentDirectory + 'uploads/' + fileName
                });
            }

            if (connectionState) {
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
                formData.append('cod_inventario', cod_inventario ? cod_inventario : '');
                formData.append('id_sede', selectedOption);
                formData.append('id_estado', selectedEstado);
                formData.append('id_clasificacion', selectedClasificacion);
                formData.append('id_usuario', selectedUsuario);
                formData.append('id_emplazamiento', selectedEmplazamiento);
                formData.append('cantidad', cantidad);
                formData.append('unidad', unidad);
                let url = '';
                if (id) {
                    url = 'https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=actualizar_inventario';
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
                if (id) {
                    const storedProductos = await AsyncStorage.getItem('productos');
                    let productList = storedProductos ? JSON.parse(storedProductos) : [];
                    const index = productList.findIndex(item => item.id === id);
                    if (index !== -1) {
                        // Actualizar el elemento específico en la lista
                        const listaSedes = options.filter(item => item.id == selectedOption);
                        const listaUsuario = usuarios.filter(item => item.id == selectedUsuario);
                        const listaEmplazamientos = emplazamientos.filter(item => item.id == selectedEmplazamiento);
                        const listaClasificacion = clasificacion.filter(item => item.id == selectedClasificacion);
                        console.log(fileName);
                        if (fileName == null) {
                            console.log("ES NULO FOTO");
                            productList[index] = {
                                id: id ? id : '',
                                cuenta: cuenta ? cuenta : '',
                                codigo_af: codigo_af ? codigo_af : '',
                                codigo_fisico: codigo_fisico ? codigo_fisico : '',
                                descripcion: descripcion ? descripcion : '',
                                marca: marca ? marca : '',
                                modelo: modelo ? modelo : '',
                                serie: serie ? serie : '',
                                medida: medida ? medida : '',
                                color: color ? color : '',
                                detalles: detalles ? detalles : '',
                                observaciones: observaciones ? observaciones : '',
                                cod_inventario: cod_inventario ? cod_inventario : '',
                                id_sede: selectedOption,
                                id_estado: selectedEstado,
                                id_clasificacion: selectedClasificacion,
                                fecha_modificacion: formatDate(Date.now()),
                                sede: listaSedes[0].sede,
                                nombres: listaUsuario[0].nombres,
                                id_usuario: selectedUsuario,
                                id_emplazamiento: selectedEmplazamiento,
                                emplazamiento: listaEmplazamientos[0].emplazamiento,
                                foto: productList[index].foto,
                                clasificacion: listaClasificacion[0].clasificacion,
                                unidad: unidad ? unidad : '',
                                cantidad: cantidad ? cantidad : '',
                            };
                        } else {
                            console.log("NO ES NULO FOTO");
                            productList[index] = {
                                id: id ? id : '',
                                cuenta: cuenta ? cuenta : '',
                                codigo_af: codigo_af ? codigo_af : '',
                                codigo_fisico: codigo_fisico ? codigo_fisico : '',
                                descripcion: descripcion ? descripcion : '',
                                marca: marca ? marca : '',
                                modelo: modelo ? modelo : '',
                                serie: serie ? serie : '',
                                medida: medida ? medida : '',
                                color: color ? color : '',
                                detalles: detalles ? detalles : '',
                                observaciones: observaciones ? observaciones : '',
                                cod_inventario: cod_inventario ? cod_inventario : '',
                                id_sede: selectedOption,
                                id_estado: selectedEstado,
                                id_clasificacion: selectedClasificacion,
                                foto: fileName,
                                fecha_modificacion: formatDate(Date.now()),
                                sede: listaSedes[0].sede,
                                nombres: listaUsuario[0].nombres,
                                id_usuario: selectedUsuario,
                                id_emplazamiento: selectedEmplazamiento,
                                clasificacion: listaClasificacion[0].clasificacion,
                                photo: {
                                    uri: photoUri,
                                    name: fileName,
                                    type: 'image/jpeg',
                                },
                                emplazamiento: listaEmplazamientos[0].emplazamiento,
                                unidad: unidad ? unidad : '',
                                cantidad: cantidad ? cantidad : '',
                            };
                        }
                        await AsyncStorage.setItem('productos', JSON.stringify(productList));
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
                        console.error('Elemento no encontrado en la lista');
                        Alert.alert(
                            'ERROR',
                            'Elemento no encontrado en la lista',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('OK Pressed'),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                } else {
                    const listaSedes = options.filter(item => item.id == selectedOption);
                    const listaUsuario = usuarios.filter(item => item.id == selectedUsuario);
                    const listaEmplazamientos = emplazamientos.filter(item => item.id == selectedEmplazamiento);
                    const listaClasificacion = clasificacion.filter(item => item.id == selectedClasificacion);
                    const storedProductos = await AsyncStorage.getItem('productos');
                    let productList = storedProductos ? JSON.parse(storedProductos) : [];
                    if (photoUri) {
                        productList.push(
                            {
                                id: id ? id : '-2',
                                cuenta: cuenta ? cuenta : '',
                                codigo_af: codigo_af ? codigo_af : '',
                                codigo_fisico: codigo_fisico ? codigo_fisico : '',
                                descripcion: descripcion ? descripcion : '',
                                marca: marca ? marca : '',
                                modelo: modelo ? modelo : '',
                                serie: serie ? serie : '',
                                medida: medida ? medida : '',
                                color: color ? color : '',
                                detalles: detalles ? detalles : '',
                                observaciones: observaciones ? observaciones : '',
                                cod_inventario: cod_inventario ? cod_inventario : '',
                                id_sede: selectedOption,
                                id_estado: selectedEstado,
                                id_clasificacion: selectedClasificacion,
                                foto: fileName,
                                fecha_modificacion: formatDate(Date.now()),
                                sede: listaSedes[0].sede,
                                nombres: listaUsuario[0].nombres,
                                id_usuario: selectedUsuario,
                                id_emplazamiento: selectedEmplazamiento,
                                emplazamiento: listaEmplazamientos[0].emplazamiento,
                                clasificacion: listaClasificacion[0].clasificacion,
                                id_local: 'id_' + Math.random().toString(16).slice(2),
                                photo: {
                                    uri: photoUri,
                                    name: fileName,
                                    type: 'image/jpeg',
                                },
                                unidad: unidad ? unidad : '',
                                cantidad: cantidad ? cantidad : '',
                            }
                        );
                    } else {
                        productList.push(
                            {
                                id: id ? id : '-2',
                                cuenta: cuenta ? cuenta : '',
                                codigo_af: codigo_af ? codigo_af : '',
                                codigo_fisico: codigo_fisico ? codigo_fisico : '',
                                descripcion: descripcion ? descripcion : '',
                                marca: marca ? marca : '',
                                modelo: modelo ? modelo : '',
                                serie: serie ? serie : '',
                                medida: medida ? medida : '',
                                color: color ? color : '',
                                detalles: detalles ? detalles : '',
                                observaciones: observaciones ? observaciones : '',
                                cod_inventario: cod_inventario ? cod_inventario : '',
                                id_sede: selectedOption,
                                id_estado: selectedEstado,
                                id_clasificacion: selectedClasificacion,
                                foto: fileName,
                                fecha_modificacion: formatDate(Date.now()),
                                sede: listaSedes[0].sede,
                                nombres: listaUsuario[0].nombres,
                                id_usuario: selectedUsuario,
                                id_emplazamiento: selectedEmplazamiento,
                                emplazamiento: listaEmplazamientos[0].emplazamiento,
                                clasificacion: listaClasificacion[0].clasificacion,
                                id_local: 'id_' + Math.random().toString(16).slice(2),
                                unidad: unidad ? unidad : '',
                                cantidad: cantidad ? cantidad : '',
                            }
                        );
                    }
                    await AsyncStorage.setItem('productos', JSON.stringify(productList));
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
                            <Camera
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
                                selectedValue={selectedOption}
                                onValueChange={handleOptionChange}
                                style={styles.textInput}
                            >
                                {options.map((option) => (
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
                        <View style={styles.action3}>
                            <Text style={styles.label}>Responsable:</Text>
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
                            <Text style={styles.label}>Código Inventario:</Text>
                            <TextInput
                                placeholder="Código Inventario"
                                placeholderTextColor="#B2BABB"
                                style={styles.textInput}
                                value={cod_inventario ? cod_inventario : ''}
                                onChangeText={text => setCodInventario(text)}
                            />
                        </View>
                    </View>
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