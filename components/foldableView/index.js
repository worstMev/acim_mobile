import React , { Component } from 'react';
import { StyleSheet ,View , Text , Button , Pressable} from 'react-native';


export default class FoldableView extends Component {
    constructor(props){
        super(props);
        //console.log('folded in constructor', this.props.folded);
        this.state = {
            folded : (this.props.folded === undefined )? true : this.props.folded ,
        };
    }

    toggleFolded = () => {
        let newFolded = !(this.state.folded);
        //console.log('toggleFolded' ,newFolded);
        this.setState({
            folded : newFolded,
        });
    }

    render(){
        console.log('render FoldableView');
        let {
            folded,
        } = this.state;
        let {
            title,
        } = this.props;
        let buttonTitle ;
        let childrenStyle;
        //console.log('folded in render ', folded);
        if( folded ) {
            buttonTitle = 'V';
            childrenStyle = StyleSheet.create({
                children : {
                    height : 0,
                    display : 'none',
                }
            });
        }else{
            buttonTitle = '^';
            childrenStyle = StyleSheet.create({
                children : {
                    height : 'auto',
                }
            });
        }
        //console.log('buttonTitle', buttonTitle);

        

        const styles = StyleSheet.create({
            foldableView : {
                borderWidth : 1,
                borderColor : 'black',
                borderRadius : 10,
                width : '90%',
                margin : 10,
            },
            title : {
                flexDirection : 'row',
                justifyContent : 'space-between',
                height : 100,
                alignItems : 'center',
                borderBottomColor : 'grey',
                borderBottomWidth : StyleSheet.hairlineWidth,
            },
            titleText : {
                fontSize : 30,
                textAlign : 'center',
            },
            titleButton : {
                height : 100,
                width : 100,
                color : 'black',
                flexDirection : 'row',
                justifyContent : 'center',
                alignItems : 'center',
            },
        });
        return(
            <Pressable style={styles.foldableView} onPress = {this.toggleFolded}>
                <View style = {styles.title} >
                    <Text style={styles.titleText} > {title || '...' } </Text>
                    <Pressable
                        onPress = {this.toggleFolded}
                        style = {styles.titleButton}
                        >
                        <Text style={{fontSize : 30 , }} >{buttonTitle}</Text>
                    </Pressable>
                </View>
                <View style={childrenStyle.children}>
                    {this.props.children}
                </View>
            </Pressable>
        );
    }
}
