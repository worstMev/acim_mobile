import React,{Component} from 'react';
import { Text , View ,ScrollView } from 'react-native';
//import { store , retrieve } from './../../functions/asyncStorage';
import Login from './../login';
import MyTask from './../myTask';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default class All extends Component{
    constructor(props){
        super(props);
        this.state = {
            logged : false,
            num_user : '',
            username : '',
            type_user : '',
        };
    }

    componentWillUnmount() {
        console.log('All unmount');
        //store('isLogged',this.state.logged);
        //store('num_user',this.state.num_user);
    }
    
    render(){
        let initialRoute ;
        let { logged } = this.state;
        if( !logged ) {
            initialRoute = "Login";
        }else{
            initialRoute = "MyTask";
        }
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName = "Login">
                    <Stack.Screen
                        name = "Login"
                        component = { Login }
                        options = {{ title : "login" }}
                    />
                    <Stack.Screen
                        name = "MyTask"
                        component = { MyTask }
                        options = {{ title : "Mes taches" }}
                    />
                </Stack.Navigator>
                
                
            </NavigationContainer>
        );
    }
}
