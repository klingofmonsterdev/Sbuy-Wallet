import React, { Component, PropTypes } from 'react';
import { Image, Text, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Container, Header, Left, Body, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
//import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Const from "../constants/Const";
const Device = require('react-native-device-detection')
const { width, height } = Dimensions.get('screen');

export default class Headers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataProfile: [],
        }
    }

    componentDidMount() {
        console.log(Device.isTablet)
        AsyncStorage.getItem('user', (error, result) => {
            this.setState({ dataProfile: JSON.parse(result) })
        });
    }

    renderRight() {
        switch (this.props.statusRight) {
            case "ADD":
                return (
                    <TouchableOpacity onPress={this.props.onPressUpload}>
                        <Icon name="md-add" style={{ color: Const.COLORMAIN, fontSize: 38 }} />
                    </TouchableOpacity>
                )
                break;

            case "INFO":
                return (
                    <TouchableOpacity onPress={this.props.onPressInfo} >
                        <Icon name="ios-alert-outline" style={{ color: Const.COLORMAIN, fontSize: 38 }} />
                    </TouchableOpacity>
                )
                break;

            case "SEARCH":
                return (
                    <TouchableOpacity onPress={this.props.onPressSearch} >
                        <Icon name="ios-search" style={{ color: Const.COLORMAIN, fontSize: 38 }} />
                    </TouchableOpacity>
                )
                break;

            case "SHARE":
                return (
                    <TouchableOpacity onPress={this.props.onPressShare} >
                        <Icon type="FontAwesome" name="share-alt" style={{ color: Const.COLORMAIN, fontSize: 35 }} />
                    </TouchableOpacity>
                )
                break;

            default:
                return (
                    null
                )
                break;
        }
    }

    renderLeft() {
        switch (this.props.statusLeft) {
            case "POP_BACK":
                return (
                    <TouchableOpacity onPress={() => Actions.pop()}>
                        <Icon name='ios-arrow-back-outline' style={{ color: Const.COLORMAIN, fontSize: 45, marginLeft: 5 }} />
                    </TouchableOpacity>
                )
                break;
            case "DRAWER_MENU":
                return (
                    <TouchableOpacity onPress={() => Actions.drawerOpen()}>
                        <Icon name='menu' type="Entypo" style={{ color: Const.COLORMAIN, fontSize: 40, marginLeft: 5 }} />
                    </TouchableOpacity>
                )
                break;

            default:
                null
                break;
        }
    }

    render() {
        return (
            <Header style={{ backgroundColor: '#FFF', height: 55, width: null }}>
                <Left>
                    {this.renderLeft()}
                </Left>
                <Body>
                    <Text numberOfLines={1} style={{ color: "#3A3A3A", fontSize: 17, fontWeight: "bold", width: 200, marginLeft: Device.isTablet ? -(width * 0.06) : -(width * 0.02) }}>{this.props.headerText}</Text>
                </Body>
                <Right>
                    {this.renderRight()}
                </Right>
            </Header>
        );
    }
}
