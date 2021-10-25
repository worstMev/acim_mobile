import React , { Component } from 'react';
import { View , Text , Button , ScrollView , StyleSheet} from 'react-native';
import { localNotification } from './../../services/LocalPushController.js';
import FoldableView from './../foldableView';
import NotifSimple from './../notifSimple';

export default class Notifs extends Component{
    constructor(props){
        super(props);
        this.state = {
            unansweredNotifsList : [],
            notifsToday : [],
        };
    }

    showNotifs = () => {
        let notifs = {
            title : 'new notifs',
            message : ' type',
            subText : 'user_sender date',
            bigText : 'details',
        };
        localNotification(notifs);
    }

    componentDidMount (){
        console.log('Notifs mounted');
        //console.log('Notifs socket ' , this.props.socket);
        //console.log('params' ,this.props.route.params);
        let { navigation } = this.props;
        let { session } = this.props.route.params;

        this.unsubscribeFocus = navigation.addListener('focus' , () => {
            console.log('notifs focus');
            if( session.num_user && this.props.socket) {
                console.log('notifs get data');
                //this.props.socket.emit('get notifs list unanswered');
                //this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all dated sent to server is converted in UTC ( -3) so we up it a bit
            }
        });
        this.props.socket.emit('get notifs list unanswered');
        this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all dated sent to server is converted in UTC ( -3) so we up it a bit

        this.props.socket.on('unanswered notifs list', (notifsList) => {
            console.log('unanswered notifs list', notifsList[0]);
            let newUnansweredNotifsList = notifsList.map( notif => ({
                num_notification : notif.num_notification,
                sender_username : notif.user_sender_username,
                num_app_user_user : notif.num_app_user_user,
                probleme_type : notif.probleme_type,
                probleme_code : notif.code,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                lieu : notif.lieu,
                remarque : notif.remarque,
                date_envoie : new Date(notif.date_envoie).toLocaleString('fr-FR'),
            }));
            this.setState({
                unansweredNotifsList : newUnansweredNotifsList,
            });
        });

        this.props.socket.on('notifs today -notifsList' , (notifsToday) => {
            console.log('notifs today -notifsList', notifsToday[0]);
            let newNotifsToday = notifsToday.map( notif => ({
                num_notification : notif.num_notification,
                sender_username : notif.user_sender_username,
                num_app_user_user : notif.num_app_user_user,
                probleme_type : notif.probleme_type,
                probleme_code : notif.code,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                lieu : notif.lieu,
                remarque : notif.remarque,
                date_envoie : new Date(notif.date_envoie).toLocaleString('fr-FR'),
                num_app_user_tech_main : notif.num_app_user_tech_main,
                date_reponse : new Date(notif.date_reponse).toLocaleString('fr-FR'),
                num_intervention : notif.num_intervention,
                date_programme : new Date(notif.date_programme).toLocaleString('fr-FR'),
                tech_main_username : notif.tech_main_username,
            }));
            this.setState({
                notifsToday : newNotifsToday,
            });
        });

        this.props.socket.on('new notif', () => {
            //udpate data from server
            this.props.socket.emit('get notifs list unanswered');
            this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all date sent to server is converted in UTC ( -3) so we up it a bit
        });

        this.props.socket.on('update notifs list unanswered -notifs', () => {
            this.props.socket.emit('get notifs list unanswered');
            this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all date sent to server is converted in UTC ( -3) so we up it a bit
        });

    }

    componentWillUnmount () {
        console.log('notifs unmount');
        this.unsubscribeFocus();
        this.props.socket.off('unanswered notifs list');
        this.props.socket.off('update notifs list unanswered -notifs');
        this.props.socket.off('notifs today -notifsList');
        this.props.socket.off('new notif');

    }

    displayToNotifs  = (list) => {
        //return list.map( intervention => <ToDo intervention={intervention} key={intervention.num_intervention}/> );
        let { navigation } = this.props;
        return list.map( notif => <NotifSimple  notification={notif} key={notif.num_notification} navigation = {navigation} session={this.props.route.params.session}/> );
    }

    render(){
        let{
            unansweredNotifsList,
            notifsToday,
        } = this.state;
        let unansweredTitle = `non repondue${(unansweredNotifsList.length > 1)? 's' : ''} : ${unansweredNotifsList.length}`;
        let todayTitle = `Notification${(notifsToday.length > 1)? 's' : ''}  d'aujourd'hui : ${notifsToday.length}`;
        const styles = StyleSheet.create({
            notifs : {
                padding : 10,
            },
            titleText : {
                fontSize : 30,
            },
        });
                            //<Button 
                            //    title={'Local Push Notification'} 
                            //    onPress={this.showNotifs} />
                            //<Button 
                            //    title={'Open notif page'} 
                            //    onPress={()=> this.props.navigation.push('notifPage',{num_notif : 'xxxxx'})} />
        return(
            <View style={styles.notifs}>
                <Text style={styles.titleText}> Notifications : </Text>
                <View style= {{ height : '94%' , alignItems : 'center' }} >
                    <ScrollView style={{width : '100%' }} >
                        <View style={{ 
                            alignItems : 'center' , 
                            justifyContent : 'space-between' ,
                            height : '100%',
                            }}>
                            <FoldableView 
                                title = {unansweredTitle} >
                                {this.displayToNotifs(unansweredNotifsList)}
                            </FoldableView>
                            <FoldableView 
                                title = {todayTitle} >
                                {this.displayToNotifs(notifsToday)}
                            </FoldableView>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
