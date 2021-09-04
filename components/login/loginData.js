import axios from 'axios';

const SERVER_BASE_URL = 'http://localhost:3500/ajax/acim';
//const SERVER_BASE_URL = 'http://192.168.1.23:3500/ajax/acim';
//const SERVER_BASE_URL = 'https://jsonplaceholder.typicode.com';

async function postRequest(url,data) {
    const axiosInstance = axios.create({
        baseURL : SERVER_BASE_URL,
    });
    let response;
    try{
        response = await axiosInstance.post(url,data);
        return response;
    }catch(err){
        console.log(`error to fetch data from ${SERVER_BASE_URL}${url}`);
        console.log(err);
    }
}
export async function testAjax () {
    const url = 'http://localhost:3500/';
    let res;
    try{
        res = await axios.get(url);
        console.log('test ajax outside and https');
        console.log(res.data);
    }catch(err){
        console.log(`error in test`);
        console.log(err);
    }
}

export async function authenticateUsername (username) {
    const url = '/authenticate/username';
    const data = { username };
    let response;
    try{
        response = await postRequest(url,data);
        console.log(' username  :'+username+' is valid '+response.data.usernameIsValid);
        return {
            usernameIsValid : response.data.usernameIsValid,
        };
    }catch(err){
        console.log(`error in authenticateUsername`);
        console.log(err);
    }
}

export async function authenticate( username , password ) {
    const url   = '/authenticate';
    const data  = { username , password };
    let response ;
    try{
        response = await postRequest(url,data);
        console.log( ' authentication success for '+username+' ' + response.data.found );
        return {
            isAuthenticated : response.data.found,
            username : response.data.row.username,
            num_user : response.data.row.num_user,
            type_user : response.data.row.type_user,
        }
    }catch(err){
        console.log('error in authenticate');
        console.log(err);
    }
}

export async function getUserType ( num_user , hmac_type_user ) {
    const url = '/type_user';
    const data = { num_user , hmac_type_user };
    let response;
    try{
        response = await postRequest(url,data);
        console.log(' getUserType ' ,response.data);
        return response.data;
    }catch(err){
        console.log('error in getUserType route %s' , url , err);
    }
}
