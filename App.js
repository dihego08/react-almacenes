import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/Login'
import HomeScreen from './screens/Home'

const AppNavigator = createStackNavigator({
	Home: {
		screen: LoginScreen
	},
	Detalle: {
		screen: HomeScreen
	}
}, {
	initialRouteName: 'Home'
});
export default createAppContainer(AppNavigator);

