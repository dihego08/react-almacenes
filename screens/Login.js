import React, { useState, Component } from "react";
import { StyleSheet, View, Text, Pressable, Button, Image, TextInput, TouchableOpacity } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import m_propietario from "../menus/m_propietario1";
import m_distribuidor from "../menus/m_distribuidor";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
//tutorial: https://www.youtube.com/watch?v=2xOTp6bxxd8
//pagina: https://www.npmjs.com/package/react-native-icons
//comando: npm i react-native-icons
//iconos: https://oblador.github.io/react-native-vector-icons/

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			check_textInputChange: false,
			secureTextEntry: true,
		};
	}

	InsertRecord = () => {
		var Email = this.state.email;
		var Password = this.state.password;

		if ((Email.length == 0) || (Password.length == 0)) {
			alert("Required Field Is Missing!!!");
		} else {
			console.log(Password);
			var APIURL = "https://diegoaranibar.com/react/iniciarsesion.php";


			var headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			};

			var Data = {
				Email: Email,
				Password: Password
			};

			fetch(APIURL, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(Data)
			})
				.then((Response) => Response.json())
				.then((Response) => {
					alert(Response[0].Message)
					if (Response[0].Message == "Success") {
						console.log("true")
						//this.props.navigation.navigate("Home");
						this.props.navigation.push("Detalle");
					}
					console.log(Data);
				})
				.catch((error) => {
					console.error("ERROR FOUND" + error);
				})
		}
	}

	updateSecureTextEntry() {
		this.setState({
			...this.state,
			secureTextEntry: !this.state.secureTextEntry
		});
	}
	render() {
		/*----BOTON MENU-PARTE1---*/
		const { navigate } = this.props.navigation;
		/*------------------------*/
		return (
			<View style={styles.viewStyle}>



				<Text style={styles.titulo}>INICIAR SESIÓN</Text>
				<Image style={styles.logo} source={require('../assets/imgs/LOGOOO.png')} />

				<View style={styles.container}>

					<View style={styles.action}>

						<View style={styles.iconocirculo}>
							<MaterialIcons name='account-circle' style={styles.iconos} />
						</View>
						<TextInput
							placeholder="Usuario"
							placeholderTextColor="#B2BABB"
							style={styles.textInput}
							onChangeText={email => this.setState({ email })}
						/>
					</View>

					<View style={styles.action}>
						<View style={styles.iconocirculo}>
							<MaterialIcons name='vpn-key' style={styles.iconos} />
						</View>
						<TextInput
							placeholder="Contraseña"
							placeholderTextColor="#B2BABB"
							style={styles.textInput}
							secureTextEntry={this.state.secureTextEntry ? true : false}
							onChangeText={password => this.setState({ password })}
						/>
						<TouchableOpacity
							onPress={this.updateSecureTextEntry.bind(this)}>
							{this.state.secureTextEntry ?
								<Feather
									name="eye-off"
									color="grey"
									size={22}
									paddingTop={25}
								/>
								:
								<Feather
									name="eye"
									color="black"
									size={22}
									paddingTop={25}
								/>
							}
						</TouchableOpacity>
					</View>


					{/* Button */}

					<View style={styles.loginButtonSection}>
						<Pressable
							style={styles.loginButton}
							onPress={() => {
								this.InsertRecord()
							}}
						>
							<Text style={styles.textbtn}>Ingresar</Text>
						</Pressable>
					</View>

				</View>

				{/*----BOTON MENU-PARTE2---*/}
				<View style={styles.botonmenus}>
					<Button
						title="Propietario"
						onPress={() =>
							navigate('MenúPropietarioI')}>
					</Button>
				</View>

				<View style={styles.botonmenus}>
					<Button
						title="Distribuidor"
						onPress={() =>
							navigate('MenúDistribuidor')}>
					</Button>
				</View>
				{/*------------------------*/}

			</View>
		);
	}
}
const styles = StyleSheet.create({
	viewStyle: {
		flex: 1,
		padding: 20,
		paddingTop: 80,
		alignItems: 'center',
		backgroundColor: '#f1f1f1',
	},
	container: {
		padding: 20,
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 40,
		elevation: 10,
	},
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

	action: {
		flexDirection: 'row',
		marginTop: 10,
		width: '90%'
	},
	textbtn: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
	loginButtonSection: {
		width: '100%',
		// height: '30%',
		marginTop: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loginButton: {
		backgroundColor: '#0000CC',
		color: 'white',
		height: 40,
		width: 180,
		justifyContent: 'center', //up dwn
		alignItems: 'center',  //r & l

		borderRadius: 30,
		elevation: 5,

	},
	botonmenus: {
		padding: 10,
	},
	logo: {
		width: 130,
		height: 130,
		marginTop: 20,
		marginBottom: 10,		
	},
	titulo: {
		fontSize: 30,
		color: '#0000CC',
		fontWeight: 'bold',
	},
	iconocirculo: {
		height: 40,
		width: 40,
		backgroundColor: '#0000CC',
		alignSelf: 'center',
		borderRadius: 40,
		elevation: 10,
		marginLeft: 5,
		marginRight: 3,
	},
	iconos: {
		fontSize: 28,
		paddingTop: 6,
		paddingLeft: 6,
		color: '#fff',
	},
});
