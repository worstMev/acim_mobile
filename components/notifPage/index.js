import React , { Component } from 'react';
import { View , Text , Button , StyleSheet , Pressable } from 'react-native';
import { format } from 'date-fns';
import { mySocket } from './../../socket_io/socket_io.js';

export default class NotifPage extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        console.log('NotifPage mounted');
        console.log('NotifPage socket ', this.props.socket);
        let { session , num_notif } = this.props.route.params;
        //get infos about notification by num_notification

    }
    componentWillUnmount(){
        console.log('NotifPage unmount');
    }
    do = (delai) => {
        let { navigation } = this.props;
        let { notification , session } = this.props.route.params;
        let num_notification = notification.num_notification;
        let num_app_user_tech_main = session.num_user;
        let obj = { num_notification , num_app_user_tech_main , delai} ;
        //or from state when we get data from socket
        
        if( this.props.socket ){
            alert ( session.username +': prise en charge de la notification ,delai :'+delai);
            console.log('=========do '+obj.delai);
            this.props.socket.emit('tech_main do' , { num_notification , num_app_user_tech_main , delai });
            navigation.push('notifs');
        }
    };

    call = (num_user) => {
        let { navigation } = this.props;
        let { session } = this.props.route.params;
        alert ( session.username +' calls , num_user :'+num_user);

    }
    render(){
        let {
            num_notif ,
            session ,
            notification
        }= this.props.route.params;
        let {
            num_notification,
            sender_username,
            num_app_user_user,
            probleme_type,
            lieu,
            statut_libelle,
            remarque,
            date_envoie,
            num_intervention,
        } = notification;
        date_envoie = format( new Date(date_envoie) , 'dd/MM/yyyy HH:mm');
        
        if (notification){
            //makes values undefined xDD
            let {
                num_notification,
                sender_username,
                num_app_user_user,
                probleme_type,
                lieu,
                statut_libelle,
                remarque,
                date_envoie,
                num_intervention,
            } = notification;
        }else{
            //from push notification , we then use the socket and update state and he get values
        }
        let styles = StyleSheet.create({
            notifPage : {
                height : '100%',
                flexDirection : 'column',
                justifyContent : 'space-between',
                alignItems : 'center',
            },
            main : {
                flex : 3,
                flexDirection : 'column',
                justifyContent : 'center',
                alignItems : 'center',
                width : '100%',
            },
            infoNotifPage : {
                flexDirection : 'column',
                justifyContent : 'space-around',
                fontSize : 30,
                width : '80%',
                height : '90%',
                backgroundColor : 'lightgrey',
                borderRadius : 10,
                padding : 20,
            },
            control : {
                flex : 1,
                width : '100%',
                flexDirection : 'column',
                alignItems : 'center',
                justifyContent : 'center',
                padding : 10,
            },
            big : {
                fontSize : 30,
            },
            button : {
                flexDirection : 'row',
                justifyContent : 'center',
                alignItems : 'center',
                flex : 1,
                width : '100%',
                borderColor : 'green',
                borderWidth : 2,
                borderRadius : 5,
                padding : 10,
            },
            buttonText : {
                fontSize : 20,
                color : 'green',
            },
            buttonTextPress : {
                fontSize : 20,
                color : 'white',
            },

        });
        return(
            <View style = {styles.notifPage}>
                <View style= {styles.main}>
                    <View style = {styles.infoNotifPage}>
                        <Text>Notification ID : {num_notif} </Text>
                        <View>
                            <Text>Probleme notifié :</Text>
                            <Text style={styles.big}>{probleme_type} </Text>
                        </View>
                        <View>
                            <Text> Lieu du probleme :</Text>
                            <Text style={styles.big}>{lieu} </Text>
                        </View>
                        <View>
                            <Text>Statut :</Text>
                            <Text style={styles.big}>{statut_libelle} </Text>
                        </View>
                        <View>
                            <Text > Envoyé par {sender_username} </Text>
                            <Text > le  {date_envoie} </Text>
                        </View>
                    </View>
                </View>
            { !num_intervention &&
                <View style = {styles.control}>
                    <Pressable 
                        style = { 
                            ({pressed})=> [
                                { backgroundColor : (pressed) ? 'green' : 'white' } , 
                                styles.button
                            ]
                        } 
                        onPress= {() => this.do(0)} > 
                        {
                            ({pressed}) => {
                                let style = (pressed) ? styles.buttonTextPress : styles.buttonText;
                                return (
                                    <Text style={style}>Prendre en charge </Text>
                                );
                            }
                        }
                     </Pressable>
                    <Pressable 
                        style = { 
                            ({pressed})=> [
                                { backgroundColor : (pressed) ? 'green' : 'white' } , 
                                styles.button
                            ]
                        } 
                        onPress= {()=> this.do(60)} > 
                        {
                            ({pressed}) => {
                                let style = (pressed) ? styles.buttonTextPress : styles.buttonText;
                                return (
                                    <Text style={style}>Faire patienter</Text>
                                );
                            }
                        }
                     </Pressable>
                </View>
            }
            </View>
        );
    }
}
