import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button, TextInput, Pressable, ScrollView, TouchableOpacity, Image } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import LoadingModal from './LoadingModal';
import { getAllControlParams, getAllAlmacenes, getAllSedes } from "./db";

export default () => {
    const [loading, setLoading] = useState(false);
    const [filteredControl, setFilteredControl] = useState([]);
    const [filteredControlAnt, setFilteredControlAnt] = useState([]);
    const [options, setSedes] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [isVisible, setVisible] = useState(false);
    const [selectedSede, setSelectedSede] = useState(0);
    const [selectedAlmacen, setSelectedAlmacen] = useState(0);

    async function fetchLocalSedes() {
        const storedOptions = await getAllSedes();
        if (storedOptions) {
            storedOptions.unshift({ id: 0, sede: "--SEDES--" });
            setSedes(storedOptions);
        }
    }
    async function fetchLocalAlmacenesFromAPI(id_sede) {
        const storedAlmacenes = await getAllAlmacenes();
        if (storedAlmacenes) {
            storedAlmacenes.unshift({ id: 0, almacen: "--ALMACEN--", id_sede: id_sede });
            setAlmacenes(storedAlmacenes.filter(item => item.id_sede == id_sede));
        }
    }
    const handleSedeChange = (value) => {
        setLoading(true);
        setSelectedSede(value);
        if (value > 0) {
            fetchLocalAlmacenesFromAPI(value);
            setVisible(true);
        } else {
            setFilteredControl([]);
            setVisible(false);
            setSelectedAlmacen(0);
        }
        setLoading(false);
    };
    const handleAlmacenChange = (value) => {
        setSelectedAlmacen(value);
    }

    const filtrarText = async () => {
        setLoading(true);
        const productosFiltrados = await getAllControlParams(selectedSede, selectedAlmacen);
        setFilteredControl(productosFiltrados);
        setFilteredControlAnt(productosFiltrados);
        setLoading(false);
    }
    const handleTextChange = async (text) => {
        if (text.length == 0) {
            setFilteredControl(filteredControlAnt);
        } else {
            let filtrado = filteredControlAnt.filter(item => item.material.toLowerCase().includes(text.toLowerCase()));
            setFilteredControl(filtrado);
        }
    }
    useEffect(() => {
        fetchLocalSedes();
    }, []);
    return (
        <View style={styles.viewStyle}>
            <View style={styles.encabezado}>
                <View style={styles.contenedorTexto}>
                    <Text style={styles.textotitulo1}>Control</Text>
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
                                selectedValue={selectedAlmacen}
                                onValueChange={handleAlmacenChange}
                                style={styles.textInput}
                            >
                                {almacenes.map((almacen) => (
                                    <Picker.Item style={{ fontSize: 12 }} key={almacen.id} label={almacen.almacen} value={almacen.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={[styles.action, { flexDirection: "row", textAlign: "center" }]}>
                        <Button title="Filtrar" style={{ textAlign: "center" }} onPress={filtrarText} disabled={loading} />
                    </View>
                </View>
            </View>
            <View style={[styles.container]}>
                <View style={styles.action}>
                    <TextInput
                        placeholder="Digite para filtrar"
                        placeholderTextColor="#B2BABB"
                        style={styles.textInput}
                        onChangeText={handleTextChange}
                    />
                    <View style={styles.iconocirculobusca}>
                        <MaterialIcons name='search' style={styles.iconosbusca} />
                    </View>
                </View>
                <ScrollView style={[styles.scrollView, { marginTop: 20 }]}
                >
                    {filteredControl.map((producto, index) => (
                        <Pressable
                            key={index}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.containerinfo}>
                                <View style={styles.contenedorTexto}>
                                    <View style={styles.textoinfo}>
                                        <Text style={styles.texto1}>{producto.material}</Text>
                                        <Text style={styles.texto1}>{producto.codigo}</Text>
                                        <Text style={styles.texto2}>{producto.sede}</Text>
                                        <Text style={styles.texto2}>{producto.almacen}</Text>
                                        <Text style={styles.texto2}>{producto.serie}</Text>
                                        <Text style={styles.texto2}>{producto.modelo}</Text>
                                        <Text style={styles.texto2}>{producto.marca}</Text>
                                    </View>
                                </View>
                                <View style={styles.textoinfo}>
                                    <Text style={[styles.texto1, styles.textoDerecha]}>{producto.cantidad}</Text>
                                    <Text style={[styles.texto1, styles.textoDerecha]}>{producto.total ?? 0}</Text>
                                    <Text style={[styles.texto1, styles.textoDerecha, { color: "red" }]}>{producto.cantidad - producto.total}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                    <LoadingModal visible={loading} />
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
    floatingButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#17a2b8', // Cambia el color del botón aquí
        justifyContent: 'center',
        alignItems: 'center',
        right: 20, // Ajusta la distancia del lado derecho
        bottom: 20, // Ajusta la distancia de la parte inferior
        elevation: 8, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
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
        marginTop: 40,
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