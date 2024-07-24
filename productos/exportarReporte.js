import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button, Dimensions, Pressable } from "react-native";
import { PieChart } from 'react-native-chart-kit';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';
import { Picker } from '@react-native-picker/picker';
const screenWidth = Dimensions.get('window').width;
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import {
    addInventario, getAllSedes, getAllEmplazamientos, getAllEstado, getAllClasificacion, getInventarioById, updateInventario, getSedeByID, getEmplazamientoByID, getEstadoByID, getClasificacionByID, getUsuarioByIdIdEmplazamiento, getAllDistinctUsuarios, getAllClasificacionNuevo, getAllClasificacionEditar, getAllUsuarios, getAllInventario, getDataGrafico
} from "./db";

export default () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [options, setSedes] = useState([]);
    const [emplazamientos, setEmplazamientos] = useState([]);
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedEmplazamiento, setSelectedEmplazamiento] = useState(null);
    const [isVisible, setVisible] = useState(false);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [inventariador, setInventariador] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [isVisibleUsuarios, setVisibleUsuarios] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        verifyConnection();
        fetchDataGrafico(0, 0, 0);
    }, []);
    const fetchDataGrafico = async (s, e, u) => {
        try {
            const result = await getDataGrafico(s, e, u);
            console.log(result);
            processData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const processData = (apiData) => {
        const colors = {
            'NULL': '#FF6384',
            'SOBRANTE': '#36A2EB',
            'UBICADO': '#FFCE56',
            'NO UBICADO': '#F00'
        };
        // Procesar los datos de la API para que sean compatibles con el gráfico
        const processedData = apiData.map(item => ({
            name: item.clasificacion || 'SIN PROCESAR',
            count: Number(item.cant),
            color: colors[item.clasificacion] || '#CCCCCC',
            legendFontColor: "#7F7F7F",
            legendFontSize: 10,
        }));
        setData(processedData);
    };
    async function verifyConnection() {
        AsyncStorage.getItem('usuarioLogin').then((storedData) => {
            const dataLogin = JSON.parse(storedData);
            setInventariador(dataLogin.nombres);
        }).catch((error) => {
            console.error('Error al obtener datos del usuario:', error);
        });

        await fetchLocalOptionsFromAPI();
        //await fetchData();
    }

    async function fetchLocalOptionsFromAPI() {
        const storedOptions = await getAllSedes();//await AsyncStorage.getItem('sedes');
        if (storedOptions) {
            storedOptions.unshift({ id: 0, sede: "--SELECCIONE--", codigo: '000', usuario_creacion: null, fecha_creacion: null });
            setSedes(storedOptions);
        }
    }
    const generatePDF = async () => {
        let tabla = '';
        let aux = 1;
        if (!selectedSede || !selectedEmplazamiento || !selectedUsuario) {
            Alert.alert(
                'Alerta',
                'Seleccionar al Sede, Emplazamiento y Usuario.',
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
        for (const producto of filteredProductos) {
            tabla += `<tr>
                <td>${aux}</td>
                <td>${producto['cuenta']}</td>
                <td>${producto['codigo_af']}</td>
                <td>${producto['descripcion']}</td>
                <td>${producto['cantidad']}</td>
                <td>${producto['unidad']}</td>
                <td>${producto['marca']}</td>
                <td>${producto['modelo']}</td>
                <td>${producto['serie']}</td>
                <td>${producto['medida']}</td>
                <td>${producto['color']}</td>
                <td>${producto['detalles']}</td>
                <td>${producto['observaciones']}</td>
                <td>${producto['clasificacion'] || ''}</td>
                <td>${producto['estado'] || ''}</td>
            </tr>`;
            aux += 1;
        }
        
        const listaSedes = await getSedeByID(selectedSede);
        let nombreUsuario = '';
        if (selectedUsuario > 0) {
            console.log(selectedEmplazamiento);
            console.log(selectedUsuario);
            const listaUsuario = await getUsuarioByIdIdEmplazamiento(selectedEmplazamiento, selectedUsuario);
            console.log(listaUsuario);
            nombreUsuario = listaUsuario.nombres;
        }
        const listaEmplazamientos = await getEmplazamientoByID(selectedEmplazamiento);

        const htmlContent = `
        <html>
            <style>
                @page {
                    margin: 20px;
                }
            </style>

            <body>
                <h3 style="display: block; text-align: center;">INVENTARIO DE ACTIVOS FIJOS Y BIENES MENORES</h3>
                <table>
                    <tr>
                        <td>SEDE:</td>
                        <td>${listaSedes.sede}</td>
                    </tr>
                    <tr>
                        <td>AMBIENTE:</td>
                        <td>${listaEmplazamientos.emplazamiento}</td>
                    </tr>
                    <tr>
                        <td>RESPONSABLE:</td>
                        <td>${nombreUsuario}</td>
                    </tr>
                </table>
                <table style="width: 100%; font-size: 9px;" border="1">
                    <tr>
                        <th style="width: auto;">NRO</th>
                        <th style="width: auto;">CUENTA</th>
                        <th style="width: auto;">CODIGO_AF</th>
                        <th style="width: auto;">DESCRIPCION</th>
                        <th style="width: auto;">CANTIDAD</th>
                        <th style="width: auto;">unidad</th>
                        <th style="width: auto;">MARCA</th>
                        <th style="width: auto;">MODELO</th>
                        <th style="width: auto;">SERIE</th>
                        <th style="width: auto;">MEDIDA</th>
                        <th style="width: auto;">COLOR</th>
                        <th style="width: auto;">DETALLES</th>
                        <th style="width: auto;">OBSERVACIONES</th>
                        <th style="width: auto;">CLASIFICACION</th>
                        <th style="width: auto;">ESTADO</th>
                    </tr>
                    ${tabla}
                </table>
                <table style="width: 100%; margin-top: 7rem;">
                    <tr>
                        <td style="width: 33.333%; text-align: center;">
                            <span style="border-top: solid 1px;">FIRMA INVENTARIADOR</span>
                        </td>
                        <td style="width: 33.333%; text-align: center;"></td>
                        <td style="width: 33.333%; text-align: center;">
                            <span style="border-top: solid 1px;">FIRMA RESPONSABLE DEL BIEN</span>
                        </td>
                    </tr>
                </table>
            </body>
      </html>
    `;
        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                name: 'Inventario ' + listaSedes.sede + '.pdf',
                orientation: Print.Orientation.landscape,
                height: 595, width: 842,
                margins: {
                    left: 20,
                    top: 50,
                    right: 20,
                    bottom: 100,
                }
            });
            setPdfUrl(uri);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    const sharePDF = async () => {
        if (pdfUrl) {
            await Sharing.shareAsync(pdfUrl);
        }
    };
    const handleOptionChange = (value) => {
        console.log("Sede => " + value);
        setSelectedSede(value);
        if (value > 0) {
            fetchLocalEmplazamientosFromAPI(value);
            fetchDataGrafico(value, 0, 0);
            setVisible(true);
        } else {
            setFilteredProductos([]);
            setVisible(false);
            setVisibleUsuarios(false);
            setSelectedEmplazamiento(0);
        }
    };
    const fetchLocalUsuarios = async (id_emplazamiento) => {
        const storedUsuarios = await getAllUsuarios();
        if (storedUsuarios) {
            storedUsuarios.unshift({ id: 0, nombres: "--SELECCIONE--", id_emplazamiento: id_emplazamiento });
            setUsuarios(storedUsuarios.filter(item => item.id_emplazamiento == id_emplazamiento));
        }
    };
    const handleEmplazamientoChange = (value) => {
        setSelectedEmplazamiento(value);
        console.log("Emplazamiento => " + value);
        if (value > 0) {
            fetchLocalUsuarios(value);
            setVisibleUsuarios(true);
            fetchDataGrafico(selectedSede, value, 0);
        } else {
            setFilteredProductos([]);
            setVisibleUsuarios(false);
            setSelectedUsuario(0);
        }
    }
    const handleUsuarioChange = async (value) => {
        console.log("USuario => " + value);
        setSelectedUsuario(value);
        if (value > 0) {
            fetchDataGrafico(selectedSede, selectedEmplazamiento, value);
            let productos = await getAllInventario();
            const productosFiltrados1 = productos.filter(
                producto => producto.id_sede == selectedSede
            );
            const productosFiltrados2 = productosFiltrados1.filter(
                producto => producto.id_emplazamiento == selectedEmplazamiento
            );
            const productosFiltrados3 = productosFiltrados2.filter(
                producto => producto.id_usuario == value
            );
            setFilteredProductos(productosFiltrados3);
        } else {
            setFilteredProductos([]);
        }
    }

    async function fetchLocalEmplazamientosFromAPI(id_sede) {
        const storedEmplazamientos = await getAllEmplazamientos();
        if (storedEmplazamientos) {
            storedEmplazamientos.unshift({ id: 0, emplazamiento: "--SELECCIONE--", id_sede: id_sede });
            setEmplazamientos(storedEmplazamientos.filter(item => item.id_sede == id_sede));
        }
    }
    const handleDownloadZip = async () => {
        try {
            Alert.alert('¡Éxito!', 'El archivo zip se ha descargado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al descargar el archivo zip.');
        }
    };
    return (
        <View style={styles.viewStyle}>
            <View style={styles.encabezado}>
                <View style={styles.action}>
                    <Picker
                        selectedValue={selectedSede}
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
                <Button title="Generar PDF" onPress={generatePDF} />
            </View>
            {pdfUrl && (
                <>
                    <Text style={{ marginTop: 20 }}>PDF generado:</Text>
                    <Text>{pdfUrl}</Text>
                    <Button title="Compartir PDF" onPress={sharePDF} />
                </>
            )}

            <PieChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
            />
            {/*<Pressable style={[styles.button, { backgroundColor: '#4590dc' }]} onPress={handleDownloadZip} >
                <MaterialIcons name='download' style={styles.iconos} /><Text style={styles.text}>Descargar Fotos</Text>
            </Pressable>*/}
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