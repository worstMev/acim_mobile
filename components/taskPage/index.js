import React , { Component } from 'react';
import { View , Text , Button , StyleSheet , Pressable } from 'react-native';
import { format } from 'date-fns';

export default class TaskPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            intervention: {},
        };
    }

    startIntervention = () => {
       let { num_intervention } = this.state.intervention;
        console.log('start intervention');
        this.props.socket.emit('start intervention' , num_intervention );
    }

    endIntervention = (resolu = false) => {
       let {    num_intervention,
                date_debut } = this.state.intervention;
        if (!date_debut) {
            console.log('pas de date de debut mais on va terminé');
        }
        console.log('resolu' , resolu);
        console.log('end intervention');
        this.props.socket.emit('end intervention' , num_intervention  , resolu , date_debut);
    }

    componentDidMount(){
        console.log('taskPage mounted');
        console.log('taskPage socket ', this.props.socket);
        let { navigation } = this.props;
        let { 
            session ,
            num_intervention 
        } = this.props.route.params;
        //get infos about  by num_notification
        this.unsubscribeFocus = navigation.addListener('focus', () => {
            if( num_intervention && this.props.socket ){
                this.props.socket.emit('get intervention data', num_intervention);
            }
        });
        this.props.socket.emit('get intervention data' , num_intervention);
        
        this.props.socket.on('intervention data' , (intervention) => {
            console.log('intervention data', intervention);
            this.setState({
                intervention : intervention ,
            });
        });

        this.props.socket.on('started intervention', (intervention) => {
            console.log('intervention started -taskPage' , intervention.num_intervention , intervention.date_debut);
            
            if ( num_intervention === intervention.num_intervention ){
                this.setState({
                    intervention : intervention,
                });
            }

        });

        this.props.socket.on('ended intervention', (intervention) => {
            console.log('intervention ended -taskPage' , intervention.num_intervention , intervention.date_debut);
            if ( num_intervention === intervention.num_intervention ){
                this.setState({
                    intervention : intervention,
                });
            }

        });
    }
    componentWillUnmount(){
        //need specific event
        console.log('taskPage unmount');
        this.props.socket.off('intervention data');
        this.props.socket.off('started intervention');
        this.props.socket.off('started intervention');
        this.props.socket.off('ended intervention');
    }

    render(){
        let {
            num_intervention ,
            session ,
            intervention ,
        }= this.props.route.params;
        //date_envoie = format( new Date(date_envoie) , 'dd/MM/yyyy HH:mm');
        let {
            libelle_intervention_type,
            commentaire,
            libelle_lieu,
            date_programme,
            motif,
            tech_main_username,
            done ,
            probleme_resolu,
            date_debut,
            date_fin,
        } = intervention;//for the data we don't need to update
        //if not there , we get from state
        done = (done) ? done : this.state.intervention.done;
        probleme_resolu = (probleme_resolu) ? probleme_resolu : this.state.intervention.probleme_resolu;
        date_debut = (date_debut) ? date_debut : this.state.intervention.date_debut;
        date_fin = (date_fin) ? date_fin : this.state.intervention.date_fin;
        if( this.state.intervention ){
            console.log('render taskPage , intervention in state OK');
        }else{
            console.log('render taskPage , no intervention in state');
        }
        commentaire = (commentaire) ? commentaire : '-';
        
        date_programme = (date_programme) ? formatDate(date_programme): '...';
        date_debut = (date_debut) ? formatDate(date_debut): '...';
        date_fin = (date_fin) ? formatDate(date_fin): '...';
        let statut_libelle = `${(done)?'Effectuée':'Non-éffectuée'} et ${(probleme_resolu)?'résolue':'non-résolue'}`;
        
        let styles = StyleSheet.create({
            taskPage : {
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
            infoTaskPage : {
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
            <View style = {styles.taskPage}>
                <View style= {styles.main}>
                    <View style = {styles.infoTaskPage}>
                        <Text>Intervention ID : {num_intervention} </Text>
                        <View>
                            <Text>Type :</Text>
                            <Text style={styles.big}>{libelle_intervention_type} </Text>
                            <Text>{commentaire}</Text>
                        </View>
                        <View>
                            <Text> Lieu :</Text>
                            <Text style={styles.big}> {libelle_lieu} </Text>
                        </View>
                        <View>
                            <Text> Date programmé :</Text>
                            <Text style={styles.big}> {date_programme} </Text>
                        </View>
                        <View>
                            <Text> Motif :</Text>
                            <Text style={styles.big}> {motif} </Text>
                        </View>
                        <View>
                            <Text>Statut :</Text>
                            <Text style={styles.big}> {statut_libelle} </Text>
                        </View>
                        <View>
                            <Text > Crééé par {tech_main_username} </Text>
                            { date_debut && date_debut !== '...' &&
                                <Text> Débutée le {date_debut} </Text>
                            }
                            { date_fin && date_fin !== '...' &&
                                <Text> Términée le { date_fin } </Text>
                            }
                        </View>
                    </View>
                </View>
                <View style = {styles.control}>
                    { !(date_debut  && date_debut !=='...') &&
                        <Pressable 
                            style = { 
                                ({pressed})=> [
                                    { backgroundColor : (pressed) ? 'green' : 'white' } , 
                                    styles.button
                                ]
                            } 
                            onPress= {() => this.startIntervention()} > 
                            {
                                ({pressed}) => {
                                    let style = (pressed) ? styles.buttonTextPress : styles.buttonText;
                                    return (
                                        <Text style={style}> Commencer </Text>
                                    );
                                }
                            }
                         </Pressable>
                    }
                    { !done &&
                        <Pressable 
                            style = { 
                                ({pressed})=> [
                                    { backgroundColor : (pressed) ? '#f2b948' : 'white' } , 
                                    styles.button
                                ]
                            } 
                            onPress= {()=> this.endIntervention()} > 
                            {
                                ({pressed}) => {
                                    let style = (pressed) ? styles.buttonTextPress : styles.buttonText;
                                    return (
                                        <Text style={style}> Terminer (non-résolue) </Text>
                                    );
                                }
                            }
                        </Pressable>
                    }
                    {  !probleme_resolu &&
                        <Pressable 
                            style = { 
                                ({pressed})=> [
                                    { backgroundColor : (pressed) ? 'green' : 'white' } , 
                                    styles.button
                                ]
                            } 
                            onPress= {()=> this.endIntervention(true)} > 

                            {
                                ({pressed}) => {
                                    let style = (pressed) ? styles.buttonTextPress : styles.buttonText;
                                    return (
                                        <Text style={style}> Probleme Résolu </Text>
                                    );
                                }
                            }
                         </Pressable>
                    }
                </View>
            </View>
        );
    }
}

function formatDate(date){
    return format( new Date(date) , 'dd/MM/yyyy à HH:mm');
}
