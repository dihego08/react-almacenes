import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from "react-native-gesture-handler";

export default class m_propietario extends Component {

    constructor(props) {

        super(props);

        


    }
    render() {
        /*----TABLA---*/
        const data = [
            { 'ID': 1, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
            { 'ID': 2, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
            { 'ID': 3, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
            { 'ID': 4, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
            { 'ID': 4, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
            { 'ID': 4, 'Nombre': 'Rosa', 'Apellidos': 'Huamán Torres', 'Celular': '954123354', 'Dirección': 'Asoc. Las Begonias', 'Referencia': 'Parque la Familia', 'Ruta': 'Selva Alegre', 'Tienda': 'Foto', 'Ubicación': 'Coordenadas' },
        ];

        const renderItem =({item})=> (
            <View style={styles.row}>
                <Text style={styles.cell}>{item.Nombre}</Text>
                <Text style={styles.cell}>{item.Apellidos}</Text>
                <Text style={styles.cell}>{item.Celular}</Text>
                <Text style={styles.cell}>{item.Dirección}</Text>
                <Text style={styles.cell}>{item.Referencia}</Text>
                <Text style={styles.cell}>{item.Ruta}</Text>
                <Text style={styles.cell}>{item.Ruta}</Text>
                <Text style={styles.cell}>{item.Tienda}</Text>
                <Text style={styles.cell}>{item.Ubicación}</Text>
            </View>
        )

        /*----BOTON PARTE1---*/
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.viewStyle}>

                {/*------ENCABEZADO-----*/}
                <View style={styles.encabezado}>
                    <View>
                        <Text style={styles.textotitulo1}>Clientes</Text>
                        <Text style={styles.textosubtitulo}>¡Estamos a su servicio!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View>
                {/*---------------------*/}

                <View style={styles.container}>

                    {/*--------BUSCAR-------------*/}
                    <View style={styles.action}>
                        <View style={styles.iconocirculobusca}>
                            <MaterialIcons name='search' style={styles.iconosbusca} />
                        </View>
                        <TextInput
                            placeholder="Digite para filtrar"
                            placeholderTextColor="#B2BABB"
                            style={styles.textInput}
                            onChangeText={email => this.setState({ email })}
                        />
                        <Pressable
                            onPress={() => navigate('NuevoCliente')}
                            style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                            }}>
                            <View style={styles.iconocirculoflotante}>
                                <MaterialIcons name='add' style={styles.iconosflotante} />
                            </View>
                        </Pressable>
                    </View>
                    {/*--------------------------*/}



                    {/*--------TABLA CRUD-------------*/}

                    <ScrollView style={styles.tabla}>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Nombre</Text>
                            <Text style={styles.heading}>Apellidos</Text>
                            <Text style={styles.heading}>Celular</Text>
                            <Text style={styles.heading}>Dirección</Text>
                            <Text style={styles.heading}>Referencia</Text>
                            <Text style={styles.heading}>Ruta</Text>
                            <Text style={styles.heading}>Tienda</Text>
                            <Text style={styles.heading}>Ubicación</Text>
                        </View>
                        <FlatList
                            data={data}
                            keyExtractor={(item)=>{item.ID.toString()}}
                            renderItem={renderItem}
                        />

                    </ScrollView>

                    {/*-------------------------------*/}


                </View>

            </View>


        );
    }
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
    textInput: {
        paddingStart: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        fontSize: 17,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#F4F6F6',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        width: '97%',

    },
    iconocirculobusca: {
        height: 30,
        width: 30,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 10,
        marginLeft: 10,
        marginTop: -30,
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
    },
    iconos: {
        fontSize: 40,
        paddingLeft: 10,
        paddingTop: 9,
        color: '#0000CC',
    },
    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    iconocirculoflotante: {
        //bottom: 3,
        //right: 0,
        //position: "absolute",
        height: 70,
        width: 70,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 7,
        marginLeft: 5,
        marginTop: 10,
    },
    iconosflotante: {
        fontSize: 60,
        paddingLeft: 5,
        paddingTop: 5,
        color: '#fff',
    },
    /*-------------------------*/
    tabla: {
        flex: 1,
        backgroundColor: "#ffff",
        paddingVertical: 20,
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: "#0000CC",
        //paddingVertical: 10,
        //paddingHorizontal: 12,
        borderRadius: 5,
        elevation: 2,
    },
    heading:{
        flex: 1,
        color: '#ffff',
        fontSize: 16,
    },
    row:{
        flexDirection:'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        //marginHorizontal: 2,
        elevation: 1,
        borderRadius: 3,
        borderBlockColor:'#fff',
        padding: 10,
        backgroundColor: '#fff',
    },
    cell:{
        fontSize: 15,
        textAlign: 'left',
        flex: 1,
    },

});