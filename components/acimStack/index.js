import React , { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { localNotification } from './../../services/LocalPushController.js';
import { mySocket } from './../../socket_io/socket_io.js';
import MyTask from './../myTask';
import Notifs from './../notifs';
import NotifStack from './../notifStack';
import MyTaskStack from './../myTaskStack';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';

const Tab = createBottomTabNavigator();

export default class AcimStack extends Component{
    constructor(props){
        super(props);
        this.state = {
            nbUnansweredNotif : 0,
            nbInterventionUndone : 0,
        };
        this.socket = mySocket.socket;
        
    }

    showNotifs = (newNotif) => {
        let { probleme_type , lieu , probleme_statut , date_envoie } = newNotif;
        console.log('show Notif , this.props.navigation : ', this.props.navigation);
        date_envoie = format( new Date(date_envoie) , 'dd/MM/yyyy HH:mm');
        let notifs = {
            title : `${probleme_type} -- ${lieu}`,
            message : `${probleme_statut}`,
            subText :  ` ${date_envoie}`,
            bigText : `${probleme_type} -- ${lieu} -- ${probleme_statut}`,
        };
        console.log('showNotifs');
        localNotification(notifs);
    }

    componentDidMount (){
        console.log('AcimStack Mounted');
        let { session } = this.props.route.params;
        mySocket.connect( session.username , session.type_user, session.num_user);

        this.socket.emit('get nb unanswered notifs');
        this.socket.emit('get nb undone intervention', session.num_user);

        this.socket.on('new notif', (newNotif) => {
            console.log('new notif acimStack');
            this.showNotifs(newNotif);
            this.socket.emit('get nb unanswered notifs');
            //get the number of unanswered notifs
        });
        
        this.socket.on('new intervention', () => {
            console.log('new intervention');
            this.socket.emit('get nb undone intervention', session.num_user);
        });

        this.socket.on('ended intervention -acimStack', () => {
            console.log('ended intervention -acimStack');
            this.socket.emit('get nb undone intervention', session.num_user);
        });


        this.socket.on('nb unanswered notifs -acimStack', (nb) => {
            console.log('nb unanswered notifs -acimStack ',nb);
            this.setState({
                nbUnansweredNotif : nb,
            });
        });

        this.socket.on('nb intervention undone -acimStack', (nb) => {
            console.log('nb intervention undone' , nb);
            this.setState({
                nbInterventionUndone : nb,
            });
        });
    }

    componentWillUnmount(){
        console.log('acimStack unmount');
        this.socket.off('new notif');
        this.socket.off('new intervention');
        this.socket.off('ended intervention -acimStack');
        this.socket.off('nb unanswered notifs -acimStack');
        this.socket.off('nb intervention undone -acimStack');
        this.socket.disconnect();
    }

    MyTaskStackWithSocket = (props) => (<MyTaskStack socket= {this.socket} {...props} />)
    NotifStackWithSocket = (props) => (<NotifStack socket = {this.socket} {...props} />)

    render(){
        let { nbUnansweredNotif ,nbInterventionUndone } = this.state;
        console.log('session in acimStack', this.props.route.params);
        let session = this.props.route.params.session;
        let initialParams = {
            session : session,
        }
        return(
            <Tab.Navigator
                screenOptions= {{
                    headerShown : false,
                }}>
               <Tab.Screen name="myTaskStack" 
                            component={ this.MyTaskStackWithSocket }
                            initialParams= {initialParams}
                            options = {{
                                title : "Mes Tâches",
                                tabBarBadge: nbInterventionUndone,
                                tabBarIcon : ({focused , color , size}) => {
                                    return <IonicIcons name="list" size={size} color={color}/>
                                }
                            }}/>
               <Tab.Screen name="notifStack" 
                            component={ this.NotifStackWithSocket }
                            initialParams= {initialParams}
                            options={{ 
                                title : "Notifications",
                                tabBarBadge: nbUnansweredNotif,
                                tabBarIcon : ({focused , color , size}) => {
                                    return <IonicIcons name="notifications" size={size} color={color}/>
                                }
                            }}/>
            </Tab.Navigator>
        );
    }
}
