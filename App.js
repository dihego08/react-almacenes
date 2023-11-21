import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/Login'
import HomeScreen from './screens/Home'
import LocationScreen from './screens/Location'

const AppNavigator = createStackNavigator({
	Home: {
		screen: LoginScreen
	},
	Detalle: {
		screen: HomeScreen
	},
	Location: {
		screen: LocationScreen
	}
}, {
	initialRouteName: 'Location'
});
export default createAppContainer(AppNavigator);

