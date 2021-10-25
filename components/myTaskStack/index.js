import React , { Component } from 'react';
import { View , Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTask from './../myTask';
import TaskPage from './../taskPage';

const Stack = createNativeStackNavigator();



export default class MyTaskStack extends Component{

    MyTaskWithSocket = (props) => (<MyTask socket = {this.props.socket} { ...props} />);
    TaskPageWithSocket = (props) => (<TaskPage socket={this.props.socket} {...props}/>);
    render () {
        console.log('socket in MyTaskStack ', this.props.socket);
        let session = this.props.route.params.session;
        let initialParams = {
            session : session,
        }
        return(
            <Stack.Navigator initialRouteName = { 'myTask' }>
                <Stack.Screen name="myTask" 
                            component={ this.MyTaskWithSocket }
                            initialParams= {initialParams}
                            options = {
                                ({navigation , route}) => ({
                                    headerShown : false,
                                })
                            }
                />
                <Stack.Screen name="taskPage" 
                            component={ this.TaskPageWithSocket }
                            initialParams= {initialParams}
                            options = {
                                ({navigation , route}) => ({
                                    title : ` Details intervention`,
                                })
                            }
                 />
            </Stack.Navigator>
        );
    }
}
