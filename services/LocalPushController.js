import PushNotification from 'react-native-push-notification';

PushNotification.configure({
    onNotification : (notification) => {
        console.log('===Local notification :',notification);
        console.log('navigation from notification' , notification.data.navigation);
    },
    popInitialNotification: true,
    requestPermissions: true,
    requestPermissions: Platform.OS === 'ios',
});
PushNotification.channelExists('acim_notifs', (exists) => {
    if(!exists){
        PushNotification.createChannel(
            {
                channelId : 'acim_notifs',
                channelName : 'acim_notifications',
            }, 
            (created)=> console.log('acim_notifs channel created'),
        );
    }else{
        console.log('acim_notifs channel already existed');
    }
});

PushNotification.getChannels((channel_ids) => {
    console.log('channel_ids', channel_ids);
});

export const localNotification = ({title, message, bigText , subText ,navigation}) => {
    PushNotification.localNotification({
        channelId : 'acim_notifs',
        autoCancel : true,
        bigText,
        subText,
        title,
        message,
        userInfo : {
            navigation ,
        },
        vibrate : true,
        vibration : 300,
        playSound : true,
        soundName: 'default',
    });
}
