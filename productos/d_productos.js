import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Text, ScrollView, TextInput, TouchableOpacity, Button } from "react-native";
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import LoadingModal from './LoadingModal';
import { withNavigationFocus } from 'react-navigation';
import ImageViewer from "./ImageViewer";
import { getAllInventario, getAllSedes, getAllEmplazamientos, getAllClasificacion, getAllInventarioByText, getAllCuentas, getAllDistinctUsuarios, configureDatabase } from "./db";

const ScreeInventario = ({ navigation, isFocused }) => {
    const [options, setSedes] = useState([]);
    const [clasificacion, setClasificacion] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [selectedClasificacion, setSelectedClasificacion] = useState(null);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [isVisibleUsuarios, setVisibleUsuarios] = useState(false);
    const [isVisibleUsuariosReal, setVisibleUsuariosReal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [filteredProductosAnt, setFilteredProductosAnt] = useState(null);
    const [textoFiltro, setTextoFiltro] = useState(null);

    useEffect(() => {
        if (isFocused) {
            fetchLocalSedes();
            fetchLocalClasificacion();
            configureDatabase();
        }
    }, [isFocused]);
    const handleImagePress = (uri) => {
        setSelectedImageUri(uri);
        setIsImageViewerVisible(true);
    };
    async function fetchLocalUsuarios() {
        const storedUsuarios = await getAllDistinctUsuarios();
        if (storedUsuarios) {
            storedUsuarios.unshift({ id: 0, nombres: "--USUARIOS--" });
            setUsuarios(storedUsuarios);
        }
    }

    async function fetchLocalSedes() {
        const storedOptions = await getAllSedes();
        if (storedOptions) {
            storedOptions.unshift({ id: 0, sede: "--SEDES--" });
            setSedes(storedOptions);
        }
    }
    async function fetchLocalClasificacion() {
        const storedOptions = await getAllClasificacion();
        if (storedOptions) {
            storedOptions.unshift({ id: 0, clasificacion: "SIN PROCESAR" });
            storedOptions.unshift({ id: -1, clasificacion: "--CLASIFICACIÓN--" });
            setClasificacion(storedOptions);
        }
    }
    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await getAllEmplazamientos();
        if (storedEmplazamientos) {
            storedEmplazamientos.unshift({ id: 0, emplazamiento: "--EMPLAZAMIENTO--", id_sede: id_sede });
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }
    async function fetchLocalCuentas() {
        const storedCuentas = await getAllCuentas();
        if (storedCuentas) {
            storedCuentas.unshift({ id: 0, cuenta: "TODAS" });
            storedCuentas.unshift({ id: -1, cuenta: "--CUENTA--" });
            setCuentas(storedCuentas);
        }
    }
    const handleSedeChange = (value) => {
        setLoading(true);
        setSelectedSede(value);
        if (value > 0) {
            fetchLocalEmplazamientosFromAPI(value);
            fetchLocalCuentas();
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
        setSelectedCuenta(0);
        if (value > 0) {
            //fetchLocalUsuarios(value);
            setVisibleUsuarios(true);
        } else {
            setFilteredProductos([]);
            setVisibleUsuarios(false);
            setSelectedUsuario(0);
        }
        setLoading(false);
    }
    const handleCuentaChange = (value) => {
        setSelectedCuenta(value);
        setLoading(true);
        setSelectedEmplazamiento(0);
        if (value >= 0 || value == 'TODAS') {
            setVisibleUsuarios(true);
        } else {
            setVisibleUsuarios(false);
            setSelectedUsuario(0);
        }
        setLoading(false);
    }
    const handleClasificacionChange = async (value) => {
        setSelectedClasificacion(value);
        if (value < 0) {
            setVisibleUsuariosReal(false);
        } else {
            fetchLocalUsuarios();
            setVisibleUsuariosReal(true);
        }
    }
    const handleUsuarioChange = async (value) => {
        setSelectedUsuario(value);
    }

    const filtrarProductos = async (text) => {
        setLoading(true);
        // Filtrar productos basados en el texto de búsqueda
        if (text) {
        } else {
            if (filteredProductosAnt) {
                setFilteredProductos(filteredProductosAnt);
            } else {
                setFilteredProductos([]);
            }
        }
        setLoading(false);
    }
    const filtrarText = async () => {
        setLoading(true);
        let text = textoFiltro;
        if (text) {
            if (text.length >= 3) {
                let productosFiltradosCombo = await filtrar();
                if (!productosFiltradosCombo) {
                    const productosFiltrados = await getAllInventarioByText(text.toLowerCase());
                    setFilteredProductos(productosFiltrados);
                } else {
                    const productosFiltrados = productosFiltradosCombo.filter(producto => {
                        const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : '';
                        const codigo_af = producto.codigo_af ? producto.codigo_af.toLowerCase() : '';
                        const codigo_fisico = producto.codigo_fisico ? producto.codigo_fisico.toLowerCase() : '';
                        const modelo = producto.modelo ? producto.modelo.toLowerCase() : '';
                        const serie = producto.serie ? producto.serie.toLowerCase() : '';
                        const marca = producto.marca ? producto.marca.toLowerCase() : '';
                        const searchText = text.toLowerCase();

                        return (
                            (descripcion.includes(searchText) ||
                                codigo_af.includes(searchText) ||
                                codigo_fisico.includes(searchText) ||
                                modelo.includes(searchText) ||
                                serie.includes(searchText) ||
                                marca.includes(searchText)) &&
                            producto.descripcion != null
                        );
                    });
                    setFilteredProductos(productosFiltrados);
                }
            }
        }
        setLoading(false);
    }
    const handleTextChange = async (text) => {
        setLoading(true);
        setTextoFiltro(text);
        await filtrarProductos(text);
        setLoading(false);
    }
    const filtrarCombos = async () => {
        setLoading(true);
        let productosFiltradosCombo = await filtrar();
        setFilteredProductos(productosFiltradosCombo);
        setFilteredProductosAnt(productosFiltradosCombo);
        setLoading(false);
    }
    const filtrar = async () => {

        if (selectedSede && selectedSede > 0) {
            let productos = await getAllInventario();
            const productosFiltrados1 = productos.filter(
                producto => producto.id_sede == selectedSede
            );

            if (selectedCuenta && (selectedCuenta > -1 || selectedCuenta == 'TODAS')) {
                let productosFiltrados2 = [];
                if (selectedCuenta == 'TODAS') {
                    productosFiltrados2 = productosFiltrados1;
                } else {
                    productosFiltrados2 = productosFiltrados1.filter(
                        producto => producto.cuenta == selectedCuenta
                    );
                }
                if (selectedClasificacion >= 0 && selectedClasificacion != null) {
                    let productosFiltrados3 = null;
                    if (selectedClasificacion == 0) {
                        productosFiltrados3 = productosFiltrados2.filter(
                            producto => producto.id_clasificacion == 0 || producto.id_clasificacion == null
                        );
                    } else {
                        productosFiltrados3 = productosFiltrados2.filter(
                            producto => producto.id_clasificacion == selectedClasificacion
                        );
                    }
                    if (selectedUsuario == 0 || selectedUsuario == null) {
                        return productosFiltrados3;
                    } else {
                        const productosFiltrados4 = productosFiltrados3.filter(
                            producto => producto.id_usuario == selectedUsuario
                        );
                        return productosFiltrados4;
                    }
                } else {
                    return productosFiltrados2;//setFilteredProductos(productosFiltrados2);
                }
            } else if (selectedEmplazamiento && selectedEmplazamiento > 0) {
                const productosFiltrados2 = productosFiltrados1.filter(
                    producto => producto.id_emplazamiento == selectedEmplazamiento
                );
                if (selectedClasificacion >= 0 && selectedClasificacion != null) {
                    let productosFiltrados3 = null;
                    if (selectedClasificacion == 0) {
                        productosFiltrados3 = productosFiltrados2.filter(
                            producto => producto.id_clasificacion == 0 || producto.id_clasificacion == null
                        );
                    } else {
                        productosFiltrados3 = productosFiltrados2.filter(
                            producto => producto.id_clasificacion == selectedClasificacion
                        );
                    }
                    if (selectedUsuario == 0 || selectedUsuario == null) {
                        return productosFiltrados3;
                    } else {
                        const productosFiltrados4 = productosFiltrados3.filter(
                            producto => producto.id_usuario == selectedUsuario
                        );
                        return productosFiltrados4;
                    }
                } else {
                    return productosFiltrados2;//setFilteredProductos(productosFiltrados2);
                }
            } else {
                return productosFiltrados1;//setFilteredProductos(productosFiltrados1);
            }
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
                    <View style={[styles.fieldSet, { display: isVisible ? 'flex' : 'none' }]}>
                        <View style={[styles.action]} >
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
                        <View style={[styles.action]} >
                            <Picker
                                selectedValue={selectedCuenta}
                                onValueChange={handleCuentaChange}
                                style={styles.textInput}
                            >
                                {cuentas.map((cuenta) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={cuenta.cuenta} label={cuenta.cuenta} value={cuenta.cuenta} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.fieldSet, { display: isVisibleUsuarios ? 'flex' : 'none' }]}>
                        <View style={[styles.action]}>
                            <Picker
                                selectedValue={selectedClasificacion}
                                onValueChange={handleClasificacionChange}
                                style={styles.textInput}
                            >
                                {clasificacion.map((item) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={item.id} label={item.clasificacion} value={item.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.fieldSet, { display: isVisibleUsuariosReal ? 'flex' : 'none' }]}>
                        <View style={[styles.action]}>
                            <Picker
                                selectedValue={selectedUsuario}
                                onValueChange={handleUsuarioChange}
                                style={styles.textInput}
                            >
                                {usuarios.map((item) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={item.id_remoto} label={item.nombres} value={item.id_remoto} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.action, { flexDirection: "row", textAlign: "center" }]}>
                        <Button title="Filtrar" style={{ textAlign: "center" }} onPress={filtrarCombos} disabled={loading} />
                    </View>
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.action}>
                    <TextInput
                        placeholder="Digite para filtrar"
                        placeholderTextColor="#B2BABB"
                        style={styles.textInput}
                        onChangeText={handleTextChange}
                    />
                    <View style={styles.iconocirculobusca}>
                        <MaterialIcons name='search' style={styles.iconosbusca}
                            onPress={filtrarText} disabled={loading} />
                    </View>
                    <View style={styles.iconocirculobusca}>
                        <MaterialIcons name='add' style={styles.iconosbusca} onPress={() => navigation.navigate('InformacionProducto', {
                            id: -1
                        })} />
                    </View>
                </View>
                <ScrollView style={styles.scrollView}
                >
                    {filteredProductos.map((producto, index) => (
                        <Pressable
                            key={index}
                            onPress={() => navigation.navigate('InformacionProducto', {
                                id: producto.id < -1 ? producto.id_local : producto.id
                            })}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.containerinfo}>
                                <View style={styles.contenedorTexto}>
                                    <View style={styles.iconocirculo}>
                                        <TouchableOpacity onPress={() => handleImagePress(FileSystem.documentDirectory + 'uploads/' + producto.foto)}>
                                            <Image style={styles.imagenProducto} source={{ uri: FileSystem.documentDirectory + 'uploads/' + producto.foto + '?rand=' + Math.random() }} />
                                        </TouchableOpacity>
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
                <ImageViewer
                    isVisible={isImageViewerVisible}
                    onClose={() => setIsImageViewerVisible(false)}
                    imageUri={selectedImageUri}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    contenedorTexto: {
        flex: 1,
        flexDirection: 'row',
    },
    fieldSet: {
        //margin: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: '#000'
    },
    legend: {
        position: 'absolute',
        top: -10,
        left: 10,
        fontWeight: 'bold',
        backgroundColor: '#FFFFFF'
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
export default withNavigationFocus(ScreeInventario);