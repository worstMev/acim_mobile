import React , { Component } from 'react';
import { View , Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notifs from './../notifs';
import NotifPage from './../notifPage';

const Stack = createNativeStackNavigator();

export default class NotifStack extends Component{
    NotifsWithSocket = (props) => (<Notifs socket={this.props.socket} {...props} />);
    NotifPageWithSocket = (props) => (<NotifPage socket={this.props.socket} {...props}/>);
    render () {
        console.log('socket in notifStack' , this.props.socket);
        let session = this.props.route.params.session;
        let initialParams = {
            session : session,
        }
        return(
            <Stack.Navigator initialRouteName = { Notifs }>
                <Stack.Screen name="notifs" 
                            component={ this.NotifsWithSocket }
                            initialParams= {initialParams}
                            options={{
                                headerShown : false,
                            }}/>
                <Stack.Screen name="notifPage" 
                            component={ this.NotifPageWithSocket }
                            initialParams= {initialParams}
                            options = {
                                ({navigation , route}) => ({
                                    title : ` Details notification `,
                                })
                            }
                 />
            </Stack.Navigator>
        );
    }
}
