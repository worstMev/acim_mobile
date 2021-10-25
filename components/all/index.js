import React,{Component} from 'react';
import { Text , View ,ScrollView, Button  , Image} from 'react-native';
import { store , retrieve } from './../../functions/asyncStorage';
import Login from './../login';
import MyTask from './../myTask';
import SplashScreen from './../splashScreen';
import AcimStack from './../acimStack';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default class All extends Component{
    constructor(props){
        super(props);
        this.state = {
            logged :  false,
            num_user : '',
            username : '',
            type_user : '',
        };
    }

    componentDidMount = async () => {
        let logged = (await retrieve('isLogged') === 'true');
        console.log('isLogged from store', logged);//no data found
        this.setState({
            logged : logged,
        });
    }

    componentWillUnmount() {
        console.log('All unmount');
        store('isLogged',`${this.state.logged}`);
        store('num_user',this.state.num_user);
    }

    logOut =async (navigation) => {
        console.log('log out' ,navigation);
        await store('isLogged','false');
        navigation.popToTop();
        //navigation.navigate('SplashScreen');
    }
    
    render(){
        let { logged } = this.state;
        console.log('in render login, logged :', logged);
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName = {SplashScreen}
                    screenOptions = {{
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            textAlign : 'center',
                        },
                    }}>
                    <Stack.Screen
                        name="SplashScreen"
                        component = { SplashScreen }
                        options = {{ title : "a.c.i.m" }}
                    />
                    <Stack.Screen
                        name = "Login"
                        component = { Login }
                        options = {
                            ( { navigation , route }) => ({
                                title : '  :  Login',
                                headerLeft : () => (
                                    <Image source={require("./../../img/base_logo_4.png")} alt="mndpt|acimi" style={{width:150 , height : 50 , resizeMode : 'contain'}}/>
                                ),
                            })
                        }
                    />
                    <Stack.Screen
                        name = "Acim"
                        component = { AcimStack }
                        options = {
                            ({navigation , route}) => ({
                                title : `  :  ${route.params.session.username}`,
                                headerLeft : () => (
                                    <Image source={require("./../../img/base_logo_4.png")} alt="mndpt|acimi" style={{width:150 , height : 50 , resizeMode : 'contain'}}/>
                                ),
                                headerRight : () => (
                                    <Button
                                        onPress = {() => this.logOut(navigation)}
                                        title = "se déconnecter"
                                        color = "#f00"
                                    />
                                ),
                            })
                        }
                    />
                </Stack.Navigator>
                
                
            </NavigationContainer>
        );
    }
}
