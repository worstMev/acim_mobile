import { io } from 'socket.io-client';
const SERVER_ADDR = 'http://192.168.1.161:3500';
const SERVER_ADDR_LOCAL = 'http://localhost:3500';

const socket = io(SERVER_ADDR_LOCAL, {
	autoConnect : false ,
});

socket.onAny((event , ...args) => {
    //console.log(`-- ${event} `, args);
    console.log(`-- ${event} `);
});

export const mySocket = {
    socket ,
    connect : (username , type_user , num_user) => {
        console.log( username , type_user , num_user );
        //connect socket
        //console.log('socket in socket_io.js',socket);
        socket.auth = {
            username,
            type_user,
            num_user,
        };
        socket.connect();
    },
    disconnect : () => {
        console.log('my socket disconnect ');
        socket.offAny();
        socket.disconnect();
    }
}
