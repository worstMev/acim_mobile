import React , { Component } from 'react';
import { Text , View , ScrollView } from 'react-native';
import { store , retrieve } from './../../functions/asyncStorage';


export default class SplashScreen extends Component {

    componentDidMount = async () => {
        console.log('SplashScreen mounted');
        //get the logged data in AsyncStorage
        //redirect accordingly
        let { navigation } = this.props;

        this.unsubscribeToFocus = navigation.addListener('focus' , async() => {
            await defineRoute();
        });

        const defineRoute = async () => {
            let isLogged = (await retrieve('isLogged') === 'true');
            let num_user = await retrieve('num_user');
            let username = await retrieve('username');
            let type_user = await retrieve('type_user');
            console.log('SplashScreen : isLogged from store', isLogged);//no data found
            if( isLogged && num_user && username && type_user ) {
                let session = {
                    num_user,
                    username,
                    type_user,
                };
                console.log('splashScreen session', session);
                navigation.navigate('Acim',{ session : session });
            }else{
                navigation.navigate('Login');
            }
        };

        await defineRoute();
    }

    componentDidUpdate () {
        console.log('SplashScreen updated');
    }

    componentWillUnmount () {
        this.unsubscribeToFocus();
    }

    
    render () {
        return (
            <View>
                <Text> Starting acim app ... </Text>
            </View>
        );
    }
}
