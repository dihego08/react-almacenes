import React, { useState, Component } from "react";
import { StyleSheet, View, Image, Pressable,TouchableOpacity,Text,Alert,} from "react-native";
import { Table, TableWrapper, Row, Cell,Col } from 'react-native-table-component';

export default class crudproductos extends Component {
   
    constructor(props) {
        super(props);
        this.encabe = {
            tableHead: ['PRODUCTOS', 'LOGO'],
            tableData: [
              ['LISTA DETALLADA'],['LOGO'],              
            ]
          }
        this.state = {
          tableHead: ['ID','NOMBRE', 'MARCA', 'PESO', 'TIPO', 'P. UNITARIO','P. CAJA','ACCIÓN'],
          tableData: [
            ['1', '2', '3', '4','5','6','7'],
            ['a', 'b', 'c', 'd','e','f','g'],
            ['1', '2', '3', '4','5','6','7'],
            ['a', 'b', 'c', 'd','e','f','g']
          ]
        }
      }
    
      _alertIndex(mod) {
        //Alert.alert(`This is row ${index + 1}`);
        Alert.alert(`Modificar`);
      }
      _alertIndex(eli) {
        //Alert.alert(`This is row ${index + 1}`);
        Alert.alert(`Eliminar`);
      }
    
	render() {
        const state = this.state;
        const encabe = this.encabe;

        const btnmod = (data, mod) => (
          <TouchableOpacity onPress={() => this._alertIndex(mod)}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>M</Text>
            </View>
          </TouchableOpacity>
          
        );
        const btnelim = (data, eli) => (
            <TouchableOpacity onPress={() => this._alertIndex(eli)}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>E</Text>
              </View>
            </TouchableOpacity>
          );
		return (
            /*------ENCABEZADO-----*/
            <View style={styles.encabezado}>
                <Table borderStyle={{ borderColor: 'transparent' }}>
                    <Row data={encabe.tableHead} textStyle={styles.text} />
                    <Row data={encabe.tableData} textStyle={styles.text} />
                </Table>
                {/*------TABLA CRUD-----*/}
                <View style={styles.container}>
                   
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'transparent' }}>
                        <Row data={state.tableHead} style={styles.head} textStyle={styles.text} />
                        {
                            state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.row}>
                                    
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex} data={cellIndex === 6 ? btnmod(cellData, index) : cellData} textStyle={styles.text} />
                                        ))
                                    }
                                    
                                </TableWrapper>
                            ))
                        }
                    </Table>
                </View>

            </View>  
		);
	}
}
const styles = StyleSheet.create({
	viewStyle: {
		flex: 1,
		padding: 20,
		marginTop: 50,
	},
    /*----ESTILOS ENCABEZADO----*/  
    encabezado: { 
        flex: 1, 
        padding: 16, 
        paddingTop: 30, 
        backgroundColor: '#F4F4F4', 
    }, 
    head: { 
        height: 40, 
        backgroundColor: '#D7D7D7' 
    },
    text: { 
        margin: 6 
    },
    row: { 
        flexDirection: 'row', 
        backgroundColor: '#F4F4F4' },
    btn: { 
        width: 58, height: 18, 
        backgroundColor: '#78B7BB',  
        borderRadius: 2 },
    btnText: { 
        textAlign: 'center', 
        color: '#fff' },
    /*---------------------------------------*/

    container: { 
        flex: 1, 
        padding: 16, 
        paddingTop: 30, 
        backgroundColor: '#fff' },
	imageboton: {
        width: 100,
        height: 100,
    }
});