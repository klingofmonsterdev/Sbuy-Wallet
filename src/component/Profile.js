import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableWithoutFeedback, FlatList, Platform } from 'react-native';
import { Item, Input, Icon, Button, Spinner } from 'native-base'

import PopupDialog from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';

import { connectApi, alertOops } from './constants/Function';
import ConstStyle from './constants/ConstStyle';
import TabFooter from './common/TabFooter';
import Validate from './common/Validate';
import Database from './database/DbUser';
import Const from './constants/Const';

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewState: "wallet", //edit,pin,wallet
            statusRefreshing: false,
            statusLoading: true,

            dataProfile: [],
            dataRespone: [
                {
                    id: 1,
                    title: "Ethereum",
                    coinType: 1,
                    statusType: 1,
                    date: "02-08-2018",
                    time: "11:18:08",
                    coinTotal: "+ 10 ETH",
                    coinRef: "0x11s3ff45..."
                },
                {
                    id: 2,
                    title: "Sbuy",
                    coinType: 2,
                    statusType: 2,
                    date: "02-08-2018",
                    time: "11:18:08",
                    coinTotal: "- 10 DOME",
                    coinRef: "01x2s3ff45..."
                },
                {
                    id: 3,
                    title: "Litecoin",
                    coinType: 3,
                    statusType: 2,
                    date: "02-08-2018",
                    time: "11:18:08",
                    coinTotal: "- 10 LTC",
                    coinRef: "0x11s3ff45..."
                },
                {
                    id: 4,
                    title: "Litecoin",
                    coinType: 3,
                    statusType: 2,
                    date: "02-08-2018",
                    time: "11:18:08",
                    coinTotal: "- 10 LTC",
                    coinRef: "0x11s3ff45..."
                }
            ]
        }
    }

    componentWillMount() {
        this.connectInit();
    }

    connectInit = () => {
        Database.getUserAuth((result) => {
            this._getBalancesAll(Const.URL._GET_BALANCES_ALL + result.key_stellar);
            this.setState({ dataProfile: result });
        });
    }

    _getBalancesAll = (url) => {
        connectApi(url, "GET", {}, {})
            .then((respone) => {
                this.setState({ dataRespone: respone.Balances })
            })
            .catch((error) => {
                console.log(" _getBalancesAsset error ", error);
            })
    }


    _renderItem = ({ item }) => {
        return (
            <View style={styles.viewCard}>
                <Text style={{ backgroundColor: "#45D25C", padding: 2, width: 50, borderRadius: 4, textAlign: 'center', marginLeft: '2%', marginTop: '2%', color: "#FFFFFF", fontSize: RF(1.5) }}>ใช้งานอยู่</Text>
                <View style={{ flex: 1, flexDirection: 'row', padding: "3%" }}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        {/* <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} /> */}
                        {this._renderImageList(item.asset_name)}
                        <View style={{ marginTop: '2%' }}>
                            <Text style={{ fontSize: RF(2.5), fontWeight: 'bold', color: '#777777' }}> {item.asset_name} </Text>
                            <Text style={{ fontSize: RF(1.5), color: '#AEAEAE', marginLeft: '5%' }}> (Stellar)</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: '2%', alignItems: "flex-end", }}>
                        <Text style={{ fontSize: RF(2.5), color: '#45D25C' }}> {item.balance} </Text>
                        <Text style={{ fontSize: RF(1.8), color: '#AEAEAE', marginLeft: '5%' }} numberOfLines={1}> <Icon name="chevron-with-circle-left" type="Entypo" style={{ color: "#45D25C", fontSize: RF(2) }} /> {this.state.dataProfile.key_stellar}</Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderView = () => {
        if (this.state.viewState == "pin") {
            return (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={require("../../assets/expeditedssl-brands.png")} resizeMode="cover" style={{ width: width * 0.3, height: width * 0.3, borderRadius: Platform.OS == "ios" ? 45 : 100 }} />
                    <Button large style={{
                        backgroundColor: "#688EFF",
                        alignSelf: 'center',
                        width: width * 0.5,
                        height: height * 0.08,
                        justifyContent: 'center',
                        borderRadius: 8,
                        marginTop: "5%",
                    }} onPress={() => Actions.PincodeEdit()}>
                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: 'bold', }}>Edit PIN</Text>
                    </Button>
                </View>
            )
        } else if (this.state.viewState == "wallet") {
            return (
                <View style={{ width: "100%", height: height * 0.35 }}>
                    <FlatList
                        data={this.state.dataRespone}
                        extraData={this.state}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderItem}
                        style={{ flex: 1 }}
                        refreshing={this.state.statusRefreshing}
                        onRefresh={this.handleRefresh}
                    />
                </View>
            )
        }
    }

    _renderImageList = (asset_name) => {
        switch (asset_name) {
            case "Jfin":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;
            case "Afin":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;
            case "SBUY":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_dome_white.png?alt=media&token=e6e18755-ade0-487e-ac32-1e793d64f06b" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;
            case "ETH":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_eth_white.png?alt=media&token=8c101f3c-8927-490c-bbb7-1b7fc714a7d4" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;
            case "BTC":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;

            default:
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.1, height: height * 0.06 }} />
                )
                break;
        }
    }


    handleRefresh = () => {
        this.setState({
            dataRespone: [],
            statusRefreshing: true
        }, () => {
            this._getBalancesAll(Const.URL._GET_BALANCES_ALL + this.state.dataProfile.key_stellar);
        })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                <View style={{ flex: 1, padding: "5%" }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableWithoutFeedback >
                            <Image source={{ uri: "https://picsum.photos/200/300" }} resizeMode="cover" style={{ width: width * 0.25, height: width * 0.25, borderRadius: Platform.OS == "ios" ? 45 : 100 }} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <Icon name="camera" type="FontAwesome" style={{ fontSize: RF(2.7), color: '#58A3EA', marginTop: "-25%", marginRight: -(width * 0.2), backgroundColor: "#FFFFFF", padding: 5, borderRadius: Platform.OS == "ios" ? 20 : 100 }} />
                        </TouchableWithoutFeedback>

                        <Text style={{ fontSize: RF(5), fontWeight: 'bold', marginTop: 30, color: '#3A3A3A', marginTop: "20%" }}>Sbuywallet</Text>
                        <Text style={{ fontSize: RF(3), marginTop: 8, color: '#6E6E6E' }}>User</Text>
                    </View>
                    <View style={{ height: height * 0.15, flexDirection: 'row', justifyContent: 'space-around', padding: "5%" }}>
                        {/* <View style={this.state.viewState == "edit" ? styles.viewTextMenuActive : styles.viewTextMenu}>
                            <Text style={this.state.viewState == "edit" ? styles.textMenuActive : styles.textMenu}>Edits</Text>
                        </View> */}
                        <TouchableWithoutFeedback onPress={() => this.setState({ viewState: "wallet" })}>
                            <View style={this.state.viewState == "wallet" ? styles.viewTextMenuActive : styles.viewTextMenu}>
                                <Text style={this.state.viewState == "wallet" ? styles.textMenuActive : styles.textMenu}>Wallet</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({ viewState: "pin" })}>
                            <View style={this.state.viewState == "pin" ? styles.viewTextMenuActive : styles.viewTextMenu}>
                                <Text style={this.state.viewState == "pin" ? styles.textMenuActive : styles.textMenu}>PIN</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>

                    {/* <View>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: height * 0.05, color: '#3A3A3A' }}>Name</Text>
                        <Item>
                            <Input
                                value={this.state.username}
                                onChangeText={username => this.setState({ username })}
                                // style={{ fontSize: Device.isTablet ? 16 : height * 0.02, height: height * 0.05, color: "#636363" }}
                                style={{ fontSize: Device.isTablet ? 16 : RF(2.5), height: Device.isTablet ? height * 0.05 : height * 0.06, color: "#636363" }}
                                keyboardType="email-address"
                            />
                        </Item>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#3A3A3A' }}>Surname</Text>
                        <Item>
                            <Input
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                                style={{ fontSize: Device.isTablet ? 16 : RF(2.5), height: Device.isTablet ? height * 0.05 : height * 0.06, color: "#636363" }}
                                secureTextEntry={this.state.statusSecureText}
                            />
                        </Item>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#3A3A3A' }}>Email</Text>
                        <Item>
                            <Input
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                                style={{ fontSize: Device.isTablet ? 16 : RF(2.5), height: Device.isTablet ? height * 0.05 : height * 0.06, color: "#636363" }}
                                secureTextEntry={this.state.statusSecureText}
                            />
                        </Item>
                    </View> */}
                    {this._renderView()}
                </View>

                <TabFooter activeTab="setting" />
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    viewTextMenu: {
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "#FFFFFF",
        // borderRadius: 25
    },
    viewTextMenuActive: {
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#58A3EA",
        borderRadius: 25
    },
    textMenu: {
        color: "#AEAEAE",
        fontSize: RF(4),
    },
    textMenuActive: {
        color: "#FFFFFF",
        fontSize: RF(4),
    },
    viewCard: {
        // height: 100,
        margin: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 5
    },
});