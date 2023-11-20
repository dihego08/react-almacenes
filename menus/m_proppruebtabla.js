import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable, Text} from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';

export default class m_propietario extends Component {
    
	constructor(props) {
        var icono = <Image style={styles.imgusuario} source={require('../assets/imgs/usuario_f.png')}/>
        var encatext1 = <Text style={styles.encatext}> Hola, </Text>
        var encatext2 = <Text style={styles.encatext}> Yaraliz </Text>
        var encatext3 = <Text style={styles.encatext}> Bienvenid(a) </Text>
        var encatext4 = <Text style={styles.encatext}> Cuenta: </Text>
        var encatext5 = <Text style={styles.encatext}> Propietario </Text>
        super(props);
        this.state = {
          tableHead: [encatext1, encatext2],
          tableData: [
            [encatext3, icono],
            [encatext4, encatext5]
          ],
        }
         /*----BOTON MENU-PARTE1---*/
		const { navigate } = this.props.navigation;
        var logo = <Image style={styles.imagelogo} source={require('../assets/imgs/LOGO1.png')}/>
        var titulo = <Text style={styles.titulo}> ADMINISTRACIÓN </Text>
        var btncli = <Pressable
                        onPress={() => navigate('crud')}
                        style={( {pressed} ) =>{
                        return {opacity: pressed ? 0 : 1}
                        }}>
                        <Image style={styles.imageboton} source={require('../assets/imgs/menu_clientes.png')}/>
                     </Pressable>
        var btnpro = <Pressable
                        onPress={() => navigate('crud')}
                        style={({ pressed }) => {
                        return { opacity: pressed ? 0 : 1 }
                        }}>
                        <Image style={styles.imageboton} source={require('../assets/imgs/menu_productos.png')} />
                    </Pressable>
        var btncon = <Pressable
                        onPress={() => navigate('crud')}
                        style={( {pressed} ) =>{
                        return {opacity: pressed ? 0 : 1}
                        }}>
                        <Image style={styles.imageboton} source={require('../assets/imgs/menu_conductores.png')}/>
                    </Pressable>
        var btnveh = <Pressable
                        onPress={() => navigate('crud')}
                        style={( {pressed} ) =>{
                        return {opacity: pressed ? 0 : 1}
                        }}>
                        <Image style={styles.imageboton} source={require('../assets/imgs/menu_vehiculos.png')}/>
                    </Pressable>
        var btnrut = <Pressable
                        onPress={() => navigate('crud')}
                        style={( {pressed} ) =>{
                        return {opacity: pressed ? 0 : 1}
                        }}>
                        <Image style={styles.imageboton2} source={require('../assets/imgs/menu_rutas.png')}/>
                    </Pressable>
       
       this.state2 = {
            //tableHead: [btncli, btncli],
            tableData: [
              [logo],
              [titulo],
              [btncli, btnpro],
              [btncon, btnveh],
              [btnrut]

            ],
          }
      }
	render() {
        const state = this.state;
        const state2 = this.state2;
       

		return (
            <View style={styles.viewStyle}>
            
                {/*------ENCABEZADO-----*/}
                <View style={styles.encabezado}>
                    { /*<Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>*/}
                    <Table borderStyle={{ borderColor: 'transparent' }}>
                        <Row data={state.tableHead}/>
                        <Rows data={state.tableData}/>
                    </Table>
                </View> 
                       
                
                <View style={styles.container}>                
                        <Table borderStyle={{ borderColor: 'transparent' }}>
                        <Rows data={state2.tableData} style={styles.menu} />
                    </Table>

                </View>

            

            </View> 
		);
	}
}
const styles = StyleSheet.create({
	viewStyle: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f1f1f1',		
	},
    /*----ESTILOS ENCABEZADO----*/  
    encabezado: {         
        padding: 16,
        
    }, 
    
    /*----------------------------*/

    container: { 
        flex: 1, 
        padding: 20, 
        paddingTop: 30, 
        backgroundColor: '#fff',
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        alignContent: 'center', 
    },
    imageboton: {
        width: 130,
        height: 130,
        marginLeft: 15,
    },
    imageboton2: {
        width: 130,
        height: 130,
        marginLeft: 15,
        marginLeft: 95,
    },
    imagelogo: {
        width: 100,
        height: 100,
        marginLeft: 110,
    },
    menu: {
       padding: 2,  
       textAlign: 'center',
       alignContent: 'center',      
    },
    titulo: {
        marginLeft: 85,
        color: '#0000CC',
        fontSize: 18,
    },
   imgusuario:{
    width: 50,
    height: 50,
   },
   encatext:{
        color: '#0000CC',
        fontSize: 13,
   },
});