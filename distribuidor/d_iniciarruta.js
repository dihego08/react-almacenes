import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable, Text} from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class m_propietario extends Component {
    
	constructor(props) {
            
        super(props);       
       
         
		
      }
	render() {
        /*----BOTON PARTE1---*/
        const { navigate } = this.props.navigation;           
		return (
            <View style={styles.viewStyle}>

                {/*------ENCABEZADO-----*/}
                <View style={styles.encabezado}>                    
                    <View>
                        <Text style={styles.textotitulo1}>Iniciar Ruta</Text>
                        <Text style={styles.textosubtitulo}>¡Es hora de iniciar!</Text>
                    </View>
                    <View>
                        <Image style={styles.imglogo} source={require('../assets/imgs/LOGO1.png')} />
                    </View>
                </View> 
                {/*---------------------*/}       
                
                <View style={styles.container}>
                    <View style={styles.containersuperior}>
                        <Image style={styles.imgusuario} source={require('../assets/imgs/usuario_f.png')} />
                        <Text style={styles.nombre}>Yaraliz Gómez</Text>
                        
                        {/*----BOTON PARTE2---*/}
                        <Pressable
                                onPress={() => navigate('crud')}
                                style={({ pressed }) => {
                                return { opacity: pressed ? 0 : 1 }
                                }}>
                                <Image style={styles.imageboton} source={require('../assets/imgs/btn_iniciarruta.png')} />
                            </Pressable>
                    </View>

                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='today' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text><Text style={styles.texto1}>Fecha:</Text> <Text style={styles.texto2}>--</Text></Text>
                            <Text><Text style={styles.texto1}>Hora Inicio:</Text> <Text style={styles.texto2}>--</Text></Text>
                            <Text><Text style={styles.texto1}>Hora Fin:</Text> <Text style={styles.texto2}>--</Text></Text>
                        </View>
                    </View>

                    <View style={styles.containerinfo}>
                        <View style={styles.iconocirculo}>
                            <MaterialIcons name='directions-car' style={styles.iconos} />
                        </View>
                        <View style={styles.textoinfo}>
                            <Text><Text style={styles.texto1}>Kilometraje:</Text> <Text style={styles.texto2}>--</Text></Text>
                            <Text><Text style={styles.texto1}>Tiempo:</Text> <Text style={styles.texto2}>--</Text></Text>
                            <Text><Text style={styles.texto1}>Paradas:</Text> <Text style={styles.texto2}>--</Text></Text>
                        </View>
                    </View>

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
    textosubtitulo:{
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
        paddingTop: 25,
        backgroundColor: '#fff',
        borderTopRightRadius: 70,
        borderTopLeftRadius: 70,
        elevation: 30,

    },
    containersuperior: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerinfo: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 13,
        margin: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        elevation: 7,
    },
    iconocirculo: {
        height: 70,
        width: 70,
        backgroundColor: '#0000CC',
        alignSelf: 'center',
        borderRadius: 40,
        elevation: 10,
        marginLeft: 5,
        marginTop: 10,
    },
    iconos: {
        fontSize: 40,
        paddingLeft: 15,
        paddingTop: 15,
        color: '#fff',
    },
    textoinfo: {
        paddingLeft: 20,
        paddingTop: 10,
    },
    imageboton: {
        width: 395,
        height: 200,
    },
    imgusuario: {
        width: 90,
        height: 90,
    },
    nombre: {
        fontSize: 25,
        color: '#0000CC',
        fontWeight: 'bold',
    },
    
    

});