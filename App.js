import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/Login'
import HomeScreen from './screens/Home'
import m_propietario1Screen from './menus/m_propietario1'
import m_propietario2Screen from './menus/m_propietario2'
import m_distribuidorScreen from './menus/m_distribuidor'
import d_iniciarrutaScreen from './distribuidor/d_iniciarruta'
import d_clientesScreen from './distribuidor/d_clientes'
import d_nuevoclienteScreen from './distribuidor/d_nuevocliente'
import d_infoclienteScreen from './distribuidor/d_infocliente'
import d_productosScreen from './distribuidor/d_productos'
import d_infoproductoScreen from './distribuidor/d_infoproducto'
import d_pedidosScreen from './distribuidor/d_pedidos'
import d_nuevopedidoScreen from './distribuidor/d_nuevopedido'
import d_infopedidoScreen from './distribuidor/d_infopedido'
import d_entregaScreen from './distribuidor/d_entrega'
import d_catalogoScreen from './distribuidor/d_catalogo'
import p_localizacionScreen from './propietario/p_localizacion'
import p_localizacionvehiculoScreen from './propietario/p_localizacionvehiculo'
import p_nuevoconductorScreen from './propietario/p_nuevoconductor'
import p_nuevovehiculoScreen from './propietario/p_nuevovehiculo'
import p_nuevarutaScreen from './propietario/p_nuevaruta'
import p_nuevoproductoScreen from './propietario/p_nuevoproducto'
import p_nuevousuarioScreen from './propietario/p_nuevousuario'
import p_catalogoScreen from './propietario/p_catalogo'
import p_reporteScreen from './propietario/p_reporte'
import p_clientesScreen from './propietario/p_clientes'

import crudproductosScreen from './frontendprop/crudproductos'
import LocationScreen from './screens/Location'

const AppNavigator = createStackNavigator({
	Home: {
		screen: LoginScreen
	},
	Detalle: {
		screen: HomeScreen
	},
	MenúPropietarioI: {
		screen: m_propietario1Screen
	},
	MenúPropietarioII: {
		screen: m_propietario2Screen
	},
	MenúDistribuidor: {
		screen: m_distribuidorScreen
	},
	IniciarRuta: {
		screen: d_iniciarrutaScreen
	},
	ClientesDistribuidor: {
		screen: d_clientesScreen
	},
	NuevoCliente: {
		screen: d_nuevoclienteScreen
	},
	InformaciónDeCliente: {
		screen: d_infoclienteScreen
	},
	ProductosDistribuidor: {
		screen: d_productosScreen
	},	
	InformaciónDeProducto: {
		screen: d_infoproductoScreen
	},
	PedidosDistribuidor: {
		screen: d_pedidosScreen
	},
	NuevoPedido: {
		screen: d_nuevopedidoScreen
	},
	InformaciónDePedido: {
		screen: d_infopedidoScreen
	},
	EntregaDePedido: {
		screen: d_entregaScreen
	},
	CatálogoDistribuidor: {
		screen: d_catalogoScreen
	},
	Localización: {
		screen: p_localizacionScreen
	},
	LocalizaciónVehículo: {
		screen: p_localizacionvehiculoScreen
	},
	NuevoConductor: {
		screen: p_nuevoconductorScreen
	},
	NuevoVehículo: {
		screen: p_nuevovehiculoScreen
	},
	NuevaRuta: {
		screen: p_nuevarutaScreen
	},
	NuevoProducto: {
		screen: p_nuevoproductoScreen
	},
	NuevoUsuario: {
		screen: p_nuevousuarioScreen
	},
	CatálogoPropietario: {
		screen: p_catalogoScreen
	},
	Reporte: {
		screen: p_reporteScreen
	},
	ClientesPropietario: {
		screen: p_clientesScreen
	},



	crud: {
		screen: crudproductosScreen
	},
	Location: {
		screen: LocationScreen
	}
}, {
	initialRouteName: 'Location'
});
export default createAppContainer(AppNavigator);

