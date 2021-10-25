import React , { Component } from 'react';
import { View , Text , StyleSheet ,Pressable } from 'react-native';
import { format } from 'date-fns';

/*
 * props:
 * - intervention from view_intervention_full : date_programme , libelle_intervention_type , libelle_lieu , tech_main_username , done , probleme_resolu
 */
export default class InterventionSimple extends Component{
    render(){
        let {
            date_programme,
            libelle_intervention_type,
            libelle_lieu,
            tech_main_username,
            num_intervention,
            probleme_resolu,
            done,
        } = this.props.intervention;
        let elemDone = (done) ? 'X':'O';
        let elemOk = (probleme_resolu) ? 'X' : 'O';
        //let date_programme_formatte = new Date(date_programme).toLocaleDateString('FR-fr')+' -- '+new Date(date_programme).toLocaleTimeString('fr-FR', {hour : '2-digit' , minute : '2-digit'});
        let date_programme_formatte = format(new Date(date_programme) , 'dd/MM/yyyy     HH:mm');
        const styles = StyleSheet.create({
            interventionSimple : {
                flexDirection : 'column',
                justifyContent : 'center',
                alignItems : 'flex-start',
                borderWidth : 2,
                borderColor : 'red',
                borderRadius : 10,
                backgroundColor : 'rgba(255, 0, 0, 0.41)',
                margin : 5,
                height : 200,
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
            info : {
                flex : 3,
            },
            indic : {
                flex : 1,
                fontSize : 30,
            },
        });
                //<View style={styles.indic}>
                //    <Text> {elemDone} </Text>
                //    <Text> {elemOk} </Text>
                //</View>
        return(
            <Pressable style={styles.interventionSimple} onPress={()=> this.props.navigation.push('taskPage', {session : this.props.session , num_intervention : num_intervention , intervention : this.props.intervention })}>
                <View style={styles.date}>
                    <Text style={styles.indic}> {date_programme_formatte} </Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.indic}> {libelle_intervention_type} </Text>
                    <Text style={styles.indic}> {libelle_lieu} </Text>
                    <Text style={styles.indic}> {tech_main_username} </Text>
                </View>
            </Pressable>
        );
    }
}
