import React , { Component } from 'react';
import { Text , View , ScrollView , StyleSheet} from 'react-native';
import { mySocket } from './../../socket_io/socket_io.js';
import FoldableView from './../foldableView';
import InterventionSimple from './../interventionSimple';

export default class MyTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            interventionListUndone : [],
            interventionListUndoneLate : [],
            interventionListUndoneToday : [],
            interventionListUndoneFuture : [],
            listPendingIntervention : [],
        };
    }

    componentDidMount(){
        console.log('MyTask mounted');
        console.log('socket in MyTask ', this.props.socket);
        console.log('params ', this.props.route.params);
        let { navigation } = this.props;
        let { session } = this.props.route.params;

        this.unsubscribeFocus = navigation.addListener('focus', ()=> {
            if (session.num_user && this.props.socket) {
                console.log('MyTask : get data');
                //this.props.socket.emit('get undone intervention' , session.num_user);
                //this.props.socket.emit('get pending intervention' , session.num_user);
            }
        });

        this.props.socket.emit('get undone intervention' , session.num_user);
        this.props.socket.emit('get pending intervention' , session.num_user);
        //this.props.socket.emit('get undone intervention' , session.num_user);
        this.props.socket.on('list undone intervention -myTask' , (listUndoneIntervention) => {
            //console.log('list undone intervention -myTask' , listUndoneIntervention);
            console.log('list undone intervention -myTask'  );
            let newList = listUndoneIntervention.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                date_debut : item.date_debut,
                date_fin : item.date_fin,
                libelle_lieu : item.libelle,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                commentaire :item.commentaire,
            }));
            let endOfDay = new Date(new Date().setHours(23,59,59)).getTime();
            let newListLate = newList.filter( item => {
                if ( item.date_debut ) return false;
                return new Date(item.date_programme).getTime() <= new Date().getTime() ;
            }); 
            let newListToday = newList.filter( item => {
                let interventionDate = new Date(item.date_programme).getTime() ;
                let startOfDay  = new Date(new Date().setHours(0,0,0)).getTime();
               
                return ( interventionDate > startOfDay && interventionDate <= endOfDay );
            });
            let newListFuture = newList.filter( item => {
                let interventionDate = new Date(item.date_programme).getTime() ;
                return ( interventionDate > endOfDay );
            });
            console.log('newListToday' , newListToday);
            this.setState({
                interventionListUndone : newList,
                interventionListUndoneLate : newListLate,
                interventionListUndoneToday : newListToday,
                interventionListUndoneFuture : newListFuture,
            });
        });

        this.props.socket.on('pending intervention -myTask', (pendingInterventions) => {
            //console.log('pending intervention -myTask', pendingInterventions);
            console.log('pending intervention -myTask' );
            let newList = pendingInterventions.map( (item,index) => ({
                num_intervention : item.num_intervention,
                num_intervention_pere : item.num_intervention_pere,
                date_programme : item.date_programme,
                libelle_lieu : item.libelle,
                date_debut : item.date_debut,
                date_fin : item.date_fin,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                probleme_resolu : item.probleme_resolu,
                libelle_probleme_tech_type : item.libelle_probleme_tech_type,
                code_intervention_type : item.code_intervention_type,
                children : item.children,
                commentaire : item.commentaire,
            }));
            this.setState({
                listPendingIntervention : newList,
            });
        });

        this.props.socket.on('new intervention -myTask', () => {
            this.props.socket.emit('get undone intervention' , session.num_user);
            this.props.socket.emit('get pending intervention' , session.num_user);
        });

        this.props.socket.on('started intervention -myTask', (intervention) => {
            console.log('started intervention -myTask');
            this.props.socket.emit('get undone intervention' , session.num_user);
            this.props.socket.emit('get pending intervention' , session.num_user);
        });
        
        
        this.props.socket.on('ended intervention -myTask', (intervention) => {
            console.log('ended intervention -myTask');
            this.props.socket.emit('get undone intervention' , session.num_user);
            this.props.socket.emit('get pending intervention' , session.num_user);
        });


    }

    componentWillUnmount () {
        console.log('myTask unmount');
        this.unsubscribeFocus();
        this.props.socket.off('list undone intervention -myTask');
        this.props.socket.off('pending intervention -myTask');
        this.props.socket.off('new intervention -myTask');
        this.props.socket.off('started intervention -myTask');
        this.props.socket.off('ended intervention -myTask');
    }

    displayToDo  = (list) => {
        //return list.map( intervention => <ToDo intervention={intervention} key={intervention.num_intervention}/> );
        return list.map( intervention => <InterventionSimple 
            intervention={intervention} 
            key={intervention.num_intervention} 
            session = { this.props.route.params.session }
            navigation = {this.props.navigation}
            /> );
    }
    render(){
        let{
            interventionListUndoneLate,
            interventionListUndoneToday,
            interventionListUndone,
            interventionListUndoneFuture,
            listPendingIntervention,
        } = this.state;
        //let x = 123;
        //let retardTitle = `En retard : ${x}`;
        //let todayTitle = `Aujourd'hui : ${x}`;
        //let futureTitle = `A venir : ${x}`;
        //let allTitle = `Toutes : ${x}`;
        let retardTitle = `En retard : ${interventionListUndoneLate.length}`;
        let pendingTitle = `En cours : ${listPendingIntervention.length}`;
        let todayTitle = `Aujourd'hui : ${interventionListUndoneToday.length}`;
        let futureTitle = `À venir : ${interventionListUndoneFuture.length}`;
        let allTitle = `Toutes : ${interventionListUndone.length}`;
        const interv = {
            date_programme : 'xxx',
            libelle_intervention_type : 'yyy',
            libelle_lieu : 'xxx',
            tech_main_username : 'fff',
            num_intervention : 'dddd',
            probleme_resolu : true,
            done : true,
        }

        const styles =  StyleSheet.create({
            myTask : {
                padding : 10,
            },
            titleText : {
                fontSize : 30,
            },
        });

        return (
            <View style={styles.myTask}>
                <Text style={styles.titleText}> {this.props.topText || 'Liste des tâches à faire'} </Text>
                    <View style={{height : '94%' , alignItems : 'center'}}>
                        <ScrollView style={{width : '100%' }} >
                            <View style={{ 
                                alignItems : 'center' , 
                                justifyContent : 'space-between' ,
                                height : '100%',
                                }}>
                                <FoldableView 
                                    title = {retardTitle} >
                                    {this.displayToDo(interventionListUndoneLate)}

                                </FoldableView>
                                <FoldableView 
                                    title = {pendingTitle} >
                                    {this.displayToDo(listPendingIntervention)}

                                </FoldableView>
                                <FoldableView 
                                    title = {todayTitle}
                                    folded = {false} >
                                    {this.displayToDo(interventionListUndoneToday)}
                                </FoldableView>
                                <FoldableView 
                                    title = {futureTitle} >
                                    {this.displayToDo(interventionListUndoneFuture)}
                                </FoldableView>
                                <FoldableView 
                                    title = {allTitle} >
                                    {this.displayToDo(interventionListUndone)}
                                </FoldableView>
                            </View>
                        </ScrollView>
                    </View>
            </View>
        );
        //return (
        //    <View>
        //        <Text> My task </Text>
        //    </View>
        //);
    }
}
