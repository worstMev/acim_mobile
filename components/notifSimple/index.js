import React , { Component } from 'react';
import { View , Text , StyleSheet ,Pressable } from 'react-native';
import { format } from 'date-fns';

/*
 * props:
 * - notification :
 */
export default class NotifSimple extends Component {
    render(){
        let {
            num_notification,
            sender_username,
            probleme_type,
            lieu,
            statut_libelle,
            statut_code ,
            remarque,
            date_envoie,
            num_intervention,
        } = this.props.notification;
        let bgColor ;
        let notifBorderColor ;
        let notifBorderWidth;
        date_envoie = format( new Date(date_envoie) , 'dd/MM/yyyy HH:mm');
        switch(statut_code){
            case 'MAX' :
                bgColor = 'red';
                break;
            case 'MID' :
                bgColor = 'yellow';
                break;
            case 'MIN' :
                bgColor = 'rgb(169, 200, 247)';
                break;
            default :
                break;
        }
        if(num_intervention){
            notifBorderColor = 'green';
            notifBorderWidth = 5;
            bgColor = 'white';
        }else{
            notifBorderColor = 'black';
            notifBorderWidth = 1;
        }
        const styles = StyleSheet.create({
            notifSimple : {
                flexDirection : 'column',
                justifyContent : 'center',
                alignItems : 'flex-start',
                backgroundColor : bgColor,
                borderRadius : 10,
                borderWidth : notifBorderWidth,
                borderColor : notifBorderColor,
                margin : 5,
                height : 200,
                padding : 10,
            },
            date : {
                flexDirection : 'column',
                justifyContent : 'center',
                alignItems : 'center',
                borderColor : 'white',
                borderBottomWidth : 1,
                fontSize : 30,
                flex :1,
                width : '100%',
            },
            indic : {
                flex :1,
                fontSize : 30,
            },
            indicSmall : {
                fontSize : 20,
            },
        });
        return (
            <Pressable style={styles.notifSimple} onPress={()=> this.props.navigation.push('notifPage', {session : this.props.session,num_notif : num_notification ,notification : this.props.notification })}>
                <View style={styles.date}>
                    <Text style={styles.indic}> {date_envoie} </Text>
                </View>
                <Text style={styles.indic}> {probleme_type} </Text>
                <Text style={styles.indic}> {lieu} </Text>
                <Text style={styles.indic}> {statut_libelle} </Text>
                <Text style={styles.indicSmall}> envoyée par {sender_username} </Text>
            </Pressable>
        );
    }
}
