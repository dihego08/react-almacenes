import { withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import React, { useState, Component, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default (props) => {
    const [searchText, setSearchText] = useState('');
    const [productos, setProductos] = useState([]);
    const { navigate } = props.navigation;

    const [options, setOptions] = useState([]);
    const [estados, setEstados] = useState([]);
    const [clasificacion, setClasificacion] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [selectedClasificacion, setSelectedClasificacion] = useState(null);

    const [cuenta, setCuenta] = useState(null);
    const [codigo_af, setCodigoAF] = useState(null);
    const [sap_padre, setSAPPadre] = useState(null);
    const [sap_componente, setSAPComponente] = useState(null);
    const [codigo_fisico, setCodigoFisico] = useState(null);
    const [descripcion, setDescripcion] = useState(null);
    const [marca, setMarca] = useState(null);
    const [modelo, setModelo] = useState(null);
    const [serie, setSerie] = useState(null);
    const [medida, setMedida] = useState(null);
    const [color, setColor] = useState(null);
    const [detalles, setDetalles] = useState(null);
    const [observaciones, setObservaciones] = useState(null);
    const [otros, setOtros] = useState(null);

    const [hasPermission, setHasPermission] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);

    useEffect(() => {
        // Función para cargar las opciones desde la API
        const fetchOptionsFromAPI = async () => {
            try {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_sedes');
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
            }
        };

        const fetchClasificacion = async () => {
            try {
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_clasificacion');
                const data = await response.json();
                console.log(data);
                setClasificacion(data);
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
            }
        };

        const fetchEstado = async () => {
            try {
                // Realizar la solicitud HTTP para obtener las opciones desde la API
                const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=lista_estados');
                const data = await response.json();
                console.log(data);
                setEstados(data);
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
            }
        };

        fetchOptionsFromAPI();
        fetchEstado();
        fetchClasificacion();

        const getData = async () => {
            try {
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

                console.log(FileSystem.documentDirectory);

                setSelectedOption(result.id_sede);
                setSelectedEstado(result.id_estado);
                setSelectedClasificacion(result.id_clasificacion);

                setCuenta(result.cuenta);
                setCodigoAF(result.codigo_af);
                setSAPPadre(result.sap_padre);
                setSAPComponente(result.sap_componente);
                setCodigoFisico(result.codigo_fisico);
                setDescripcion(result.descripcion);
                setMarca(result.marca);
                setModelo(result.modelo);
                setSerie(result.serie);
                setMedida(result.medida);
                setColor(result.color);
                setDetalles(result.detalles);
                setObservaciones(result.observaciones);
                setOtros(result.otros);
                console.log('Response from server:', result);
            } catch (error) {
                console.error('Error al obtener opciones desde la API:', error);
            }
        }
        getData();
    }, []);

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const handleEstadoChange = (value) => {
        setSelectedEstado(value);
    };

    const handleClasificacionChange = (value) => {
        setSelectedClasificacion(value);
    };

    const takePicture = async () => {
        if (cameraRef) {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === 'granted') {
                const photo = await cameraRef.takePictureAsync();
                setPhotoUri(photo.uri);
            } else {
                console.error('Permission denied for camera');
            }
        }
    };
    
    const uploadPhotoToServer = async () => {
        try {
            console.log("SI ENTRO AKI");
            const formData = new FormData();
            formData.append('photo', {
                uri: photoUri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            });

            formData.append('cuenta', cuenta.cuenta);
            formData.append('codigo_af', codigo_af.codigo_af);
            formData.append('sap_padre', sap_padre.sap_padre);
            formData.append('sap_componente', sap_componente.sap_componente);
            formData.append('codigo_fisico', codigo_fisico.codigo_fisico);
            formData.append('descripcion', descripcion.descripcion);
            formData.append('marca', marca.marca);
            formData.append('modelo', modelo.modelo);
            formData.append('serie', serie.serie);
            formData.append('medida', medida.medida);
            formData.append('color', color.color);
            formData.append('detalles', detalles.detalles);
            formData.append('observaciones', observaciones.observaciones);
            formData.append('otros', otros.otros);

            formData.append('id_sede', selectedOption);
            formData.append('id_estado', selectedEstado);
            formData.append('id_clasificacion', selectedClasificacion);

            const response = await fetch('https://diegoaranibar.com/almacen/servicios/servicios.php?parAccion=actualizar_inventario', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            console.log('Response from server:', result);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    return (

        <View style={styles.viewStyle}>

            {/*------ENCABEZADO-----*/}
            <View style={styles.encabezado}>
                <View>
                    <Text style={styles.textotitulo1}>Detalle Elemento</Text>
                    <Text style={styles.textosubtitulo}>¡Ofrecemos calidad!</Text>
                </View>
                <View>
                    <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                </View>
            </View>
            {/*---------------------*/}

            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.action}>
                        <Camera
                            ref={(ref) => {
                                setCameraRef(ref);
                            }}
                            style={styles.camera}
                            ratio="4:3"
                        />

                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='photo' style={styles.iconos} onPress={takePicture} />
                        </View>

                        {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}

                    </View>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Cuenta"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={cuenta ? cuenta : ''}
                            onChangeText={cuenta => setCuenta({ cuenta })}
                        />
                    </View>

                    <View style={styles.action}>
                        <Picker
                            selectedValue={selectedOption}
                            onValueChange={handleOptionChange}
                            style={styles.textInput}
                        >
                            {options.map((option) => (
                                <Picker.Item key={option.id} label={option.sede} value={option.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Código AF"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={codigo_af ? codigo_af : ''}
                            onChangeText={codigo_af => setCodigoAF({ codigo_af })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="SAP Padre"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={sap_padre ? sap_padre : ''}
                            onChangeText={sap_padre => setSAPPadre({ sap_padre })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="SAP Componente"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={sap_componente ? sap_componente : ''}
                            onChangeText={sap_componente => setSAPComponente({ sap_componente })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Código Físico"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={codigo_fisico ? codigo_fisico : ''}
                            onChangeText={codigo_fisico => setCodigoFisico({ codigo_fisico })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Descripción"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={descripcion ? descripcion : ''}
                            onChangeText={descripcion => setDescripcion({ descripcion })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Marca"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={marca ? marca : ''}
                            onChangeText={marca => setMarca({ marca })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Modelo"
                            placeholderTextColor="#B2BABB"
                            value={modelo ? modelo : ''}
                            style={styles.textInput}
                            onChangeText={modelo => setModelo({ modelo })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Serie"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={serie ? serie : ''}
                            onChangeText={serie => setSerie({ serie })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Medida"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={medida ? medida : ''}
                            onChangeText={medida => setMedida({ medida })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Color"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={color ? color : ''}
                            onChangeText={color => setColor({ color })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Detalles"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={detalles ? detalles : ''}
                            onChangeText={detalles => setDetalles({ detalles })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Observaciones"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={observaciones ? observaciones : ''}
                            onChangeText={observaciones => setObservaciones({ observaciones })}
                        />
                    </View>

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Otros"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            value={otros ? otros : ''}
                            onChangeText={otros => setOtros({ otros })}
                        />
                    </View>

                    <View style={styles.action}>
                        <Picker
                            selectedValue={selectedClasificacion}
                            onValueChange={handleClasificacionChange}
                            style={styles.textInput}
                        >
                            {clasificacion.map((option) => (
                                <Picker.Item key={option.id} label={option.clasificacion} value={option.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.action}>
                        <Picker
                            selectedValue={selectedEstado}
                            onValueChange={handleEstadoChange}
                            style={styles.textInput}
                        >
                            {estados.map((option) => (
                                <Picker.Item key={option.id} label={option.estado} value={option.id} />
                            ))}
                        </Picker>
                    </View>


                    {/* Button */}

                    <View style={styles.loginButtonSection}>
                        <Pressable
                            style={styles.loginButton}
                            onPress={uploadPhotoToServer}
                        >
                            <Text style={styles.textbtn}>Guardar</Text>
                        </Pressable>
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
        marginLeft: 80,
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
        width: '97%',

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
        height: 65,
        width: 65,
        backgroundColor: '#f1f1f1',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    iconos: {
        fontSize: 45,
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
        fontSize: 17,
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
    }
});