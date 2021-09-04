import React,{Component} from 'react';
import { StyleSheet ,Text , View ,TextInput , Image , Button} from 'react-native';
import { authenticateUsername ,testAjax ,authenticate ,getUserType } from './loginData.js';
import { User } from './../../functions/userTypes.js';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            usernameIsValid : false,
            submittedUsername : '',
            submittedPassword : '',
        }
    }

    updateSubmittedUsername = (text) => {
        console.log('updateSubmittedUsername', text);
        this.setState({
            submittedUsername : text,
        });
    }

    updateSubmittedPassword = (text) => {
        this.setState({
            submittedPassword : text,
        });
    }
    //checkCredentials = (e) => {
    //    alert('check username')
    //}
    toggle = () => {
        let newUsernameIsValid = !this.state.usernameIsValid;
        this.setState({
            usernameIsValid : newUsernameIsValid,
        });

    }

    checkCredentials = async (e) => {
        e.preventDefault();
        console.log('check username');
        let { submittedUsername , submittedPassword , usernameIsValid } = this.state;
        let { navigation } = this.props;
        console.log('submittedUsername' , submittedUsername);

        if( !this.state.usernameIsValid && submittedUsername) {
            console.log('check username by ajax ' , submittedUsername);
            try{
                const response = await authenticateUsername(this.state.submittedUsername);
                console.log(response);
                this.setState({
                    usernameIsValid : response.usernameIsValid,
                });
            
            //    const test = await testAjax();
            //    console.log(test);
            }catch(err){
                console.error('error in checkCredentials' , err);
            }

        }else{
            console.log('authenticate username/password', submittedUsername ,submittedPassword);
            try{
                const response = await authenticate(this.state.submittedUsername , this.state.submittedPassword);
                console.log(response);
                if( response.isAuthenticated ){

                    //this.props.setCredentials({
                    //    logged : true,
                    //    num_user : response.num_user,
                    //    username : response.username,
                    //    type_user   : response.type_user,
                    //});
                    alert('You are logged');
                    const userType = await getUserType( response.num_user , response.type_user);
                    console.log('userType' , userType);
                    
                    if ( userType === User.TECH_MAIN.code ) navigation.navigate('MyTask');
                    //navigation.navigate("MyTask");
                    console.log('is Tech_main' , userType )
                    console.log('response',response);
                    console.log(' type_user from server '+ response.type_user);
                }
            }catch(err){
                console.log('error in checkCrendentials' , err);
            }
        }
    }
    render(){
        let{
            submittedUsername,
            submittedPassword,
            usernameIsValid,
        } = this.state;
        return(
            <View style={styles.login}>
                <View style={styles.ImageContainer}>
                    <Image source={require("./../../img/base_logo_sans_texte.png")} alt="mptdn|acim" id="logo" style={styles.Image}/>
                </View>
                <View style={styles.InputContainer}>
                    
            { (usernameIsValid) ?
                    <TextInput style = {styles.Input}
                        secureTextEntry = {true}
                        placeholder = "mot de passe"
                        value = {submittedPassword}
                        onChangeText = {this.updateSubmittedPassword}
                        onSubmitEditing = {this.checkCredentials}
                        autoFocus = {true}/>
                :
                    <TextInput style = {styles.Input}
                        placeholder = "utilisateur"
                        value = {submittedUsername}
                        onChangeText = {this.updateSubmittedUsername}
                        onSubmitEditing = {this.checkCredentials}
                        autoFocus = {true}/>
            }
                    <Button style = {styles.Button}
                            title = ">"
                            color = "red"
                            onPress = { this.checkCredentials}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    login : {
        flex: 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    Image :{
        flex : 1,
        width : null,
        height : null,
        resizeMode : 'contain',
    },
    ImageContainer : {
        //borderWidth : 5,
        height : 100,
        width : 500,
    },
    InputContainer : {
        width : 500*0.75,
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    Button : {
        textAlign : 'center',
    },
    Input : {
        borderWidth : 1,
        flex : 1,
        fontSize : 20,
    },

});
