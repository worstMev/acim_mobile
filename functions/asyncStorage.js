import AsyncStorage from '@react-native-async-storage/async-storage';

export async function store(key,value){
    try{
        await AsyncStorage.setItem( key , value);
    }catch(err){
        console.log('error in functions/asyncStorage/store', err);
    }
}

export async function retrieve(key){
    let val;
    try{
        val = await AsyncStorage.getItem(key);
        if( val ) return val;
        else throw `no value stored for key:${key}`;
        
    }catch(err){
        console.log('error in functions/asyncStorage/retrieve', err);
    }
}
