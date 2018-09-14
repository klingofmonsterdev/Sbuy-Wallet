import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image } from 'react-native';
import { StyleProvider, Container, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import getTheme from '../../../native-base-theme/components';
import platform from '.../../../native-base-theme/variables/platform';
import RF from 'react-native-responsive-fontsize';

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class TabFooter extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Footer>
                    <FooterTab>
                        <Button vertical active={this.props.activeTab == "home" ? true : false} onPress={() => Actions.Home()}>
                            {
                                this.props.activeTab == "home" ?
                                    <Image source={require("../../../assets/icm_home_active.png")} resizeMode="contain" style={styles.imageStyle} />
                                    :
                                    <Image source={require("../../../assets/icm_home.png")} resizeMode="contain" style={styles.imageStyle} />
                            }
                            <Text style={this.props.activeTab == "home" ? styles.textStyleActive : styles.textStyle}>หน้าแรก</Text>
                        </Button>

                        <Button vertical active={this.props.activeTab == "exchange" ? true : false} onPress={() => Actions.Exchange()}>
                            {
                                this.props.activeTab == "exchange" ?
                                    <Image source={require("../../../assets/icm_exchange_active.png")} resizeMode="contain" style={styles.imageStyle} />
                                    :
                                    <Image source={require("../../../assets/icm_exchange.png")} resizeMode="contain" style={styles.imageStyle} />
                            }
                            <Text style={this.props.activeTab == "exchange" ? styles.textStyleActive : styles.textStyle} numberOfLines={1}>การแลกเปลี่ยน</Text>
                        </Button>

                        <Button vertical active={this.props.activeTab == "domepay" ? true : false} onPress={() => Actions.DomePay()}>
                            {
                                this.props.activeTab == "domepay" ?
                                    <Image source={require("../../../assets/icm_domepay_active.png")} resizeMode="contain" style={styles.imageStyle} />
                                    :
                                    <Image source={require("../../../assets/icm_domepay.png")} resizeMode="contain" style={styles.imageStyle} />
                            }
                            <Text style={this.props.activeTab == "domepay" ? styles.textStyleActive : styles.textStyle}>DomePay</Text>
                        </Button>

                        <Button vertical active={this.props.activeTab == "merchant" ? true : false} onPress={() => Actions.Pay()}>
                            {
                                this.props.activeTab == "merchant" ?
                                    <Image source={require("../../../assets/icm_merchant_active.png")} resizeMode="contain" style={styles.imageStyle} />
                                    :
                                    <Image source={require("../../../assets/icm_merchant.png")} resizeMode="contain" style={styles.imageStyle} />
                            }
                            <Text style={this.props.activeTab == "merchant" ? styles.textStyleActive : styles.textStyle}>Merchant</Text>
                        </Button>

                        <Button vertical active={this.props.activeTab == "setting" ? true : false} onPress={() => Actions.Profile()}>
                            {
                                this.props.activeTab == "setting" ?
                                    <Image source={require("../../../assets/icm_setting_active.png")} resizeMode="contain" style={styles.imageStyle} />
                                    :
                                    <Image source={require("../../../assets/icm_setting.png")} resizeMode="contain" style={styles.imageStyle} />
                            }
                            <Text style={this.props.activeTab == "setting" ? styles.textStyleActive : styles.textStyle}>ตั้งค่า</Text>
                        </Button>

                    </FooterTab>
                </Footer>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: RF(2),
        color: "rgba(174, 174, 174,0.5)"
    },
    textStyleActive: {
        fontSize: RF(2),
        color: "#58A3EA"
    },
    imageStyle: {
        width: "60%",
        height: "60%",
    },
});