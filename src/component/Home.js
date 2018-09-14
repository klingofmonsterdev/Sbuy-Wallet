import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Container, Item, Input, Icon, Button, Spinner } from 'native-base';

import PopupDialog from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

// ========== Firebase ==========
import firebase from 'firebase';
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
// ==============================

import { connectApi, alertOops } from './constants/Function';
import ConstStyle from './constants/ConstStyle';
import TabFooter from './common/TabFooter';
import Validate from './common/Validate';
import Database from './database/DbUser';
import Const from './constants/Const';

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCrypto: [],
            dataProfile: [],

            headCoinImage: "",
            headCoinName: "-",
            headCoinAssetName: "-",
            headCoinBalance: "-",
            headCoinBalanceUSD: "-",
            headCoinRate: "-",
            headCoinChange: "Change (24h)  0%",

            urlGet: "",
            statusRefreshing: false,
            statusLoading: true,

            dataRespone: [
                // {
                //     id: 1,
                //     title: "Ethereum",
                //     coinType: 1,
                //     statusType: 1,
                //     date: "02-08-2018",
                //     times: "11:18:08",
                //     coinTotal: "+ 10 ETH",
                //     coinRef: "0x11s3ff45..."
                // },
                // {
                //     id: 2,
                //     title: "Sbuy",
                //     coinType: 2,
                //     statusType: 2,
                //     date: "02-08-2018",
                //     times: "11:18:08",
                //     coinTotal: "- 10 DOME",
                //     coinRef: "01x2s3ff45..."
                // },
                // {
                //     id: 3,
                //     title: "Litecoin",
                //     coinType: 3,
                //     statusType: 2,
                //     date: "02-08-2018",
                //     times: "11:18:08",
                //     coinTotal: "- 10 LTC",
                //     coinRef: "0x11s3ff45..."
                // }
            ]
        }
    }

    componentWillMount() {
        this.firebaseDbCrypto = firebase.database().ref("sbuywallet/crypto/");
        this._getListCrypto();
    }

    async componentDidMount() {

        await this.dialogLoading.show();

        await this._setStateDataProfile();

        await this.dialogLoading.dismiss();
    }

    _setStateDataProfile = () => {
        Database.getUserAuth((result) => {
            this.setState({
                dataProfile: result,
                urlGet: "https://api.afin.network/sbuy-api/accounts/" + result.key_stellar + "/payments"
            }, () => {
                this._getBalancesAsset(result.key_stellar, "Jfin");
                this._getTransaction("https://api.afin.network/sbuy-api/accounts/" + result.key_stellar + "/payments");
            });
        });
    }

    _getBalancesAsset = (key_stellar, asset_name) => {
        connectApi(Const.URL._GET_BALANCES_ASSET, "GET", {}, {
            "asset_name": asset_name,
            "stellar_wallet": key_stellar,
        })
            .then((respone) => {
                this.setState({
                    headCoinAssetName: respone.Balances[0].asset_name,
                    headCoinBalance: respone.Balances[0].balance,

                }, () => {
                    this._getRate(respone.Balances[0].asset_name, respone.Balances[0].balance)
                });
            })
            .catch((error) => {
                console.log(" _getBalancesAsset error ", error);
            })
    }

    _getTransaction = (url) => {
        console.log("URL : ", url);

        this.setState({ statusRefreshing: true }, () => {
            connectApi(url, "GET", {}, {})
                .then((respone) => {
                    console.log('================== respone ==================');
                    console.log(respone);
                    console.log("URL NEXT : " + respone._links.next.href);
                    console.log('====================================');
                    this.setState({
                        urlGet: respone._links.next.href,
                        dataRespone: [...this.state.dataRespone, ...respone._embedded.records],
                        statusRefreshing: false
                    })
                })
                .catch((error) => {
                    this.setState({ statusRefreshing: false });
                    console.log(" _getTransaction error ", error);
                })
        })
    }

    _getRate = (asset_name, balance) => {
        connectApi(Const.URL._GET_BALANCES_RATE + asset_name, "GET", {}, {})
            .then((respone) => {
                this.setState({
                    headCoinBalanceUSD: balance * respone.Rate[0].usd,
                    headCoinChange: "Change (24h) " + respone.Rate[0].change + "%",
                    headCoinRate: "1 " + asset_name + " = " + respone.Rate[0].usd + " USD"
                });
            })
            .catch((error) => {
                console.log("_getRate error", error);
            })
    }

    _getListCrypto = () => {
        this.firebaseDbCrypto.on('value', (snap) => {
            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    asset_name: child.val().asset_name,
                    icon_white: child.val().icon_white,
                    icon: child.val().icon,
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({
                dataCrypto: items,
                headCoinImage: items[0].icon_white,
                headCoinName: items[0].name,
            });
        });
    }

    onOpen = (index) => {
        this.setState({
            headCoinImage: this.state.dataCrypto[index].icon_white,
            headCoinName: this.state.dataCrypto[index].name,
            headCoinBalance: "-",
            headCoinAssetName: "-",

            headCoinBalanceUSD: "-",
            headCoinChange: "-",
            headCoinRate: "-"
        }, () => {
            this._getBalancesAsset(this.state.dataProfile.key_stellar, this.state.dataCrypto[index].asset_name);
        });
    }

    //====== FlatList =====
    _renderItem = ({ item }) => {
        return (
            <View style={styles.viewCard}>
                <Text style={{ backgroundColor: item.type_payment == "withdraw" ? "#FF5129" : "#45D25C", padding: 2, width: 50, borderRadius: 4, textAlign: 'center', marginLeft: '2%', marginTop: '2%', color: "#FFFFFF", fontSize: RF(1.5) }}>{item.type_payment == "withdraw" ? "ถอน" : "ฝาก"}</Text>
                <View style={{ flex: 1, flexDirection: 'row', padding: "3%" }}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        {/* <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} /> */}
                        {this._renderImageList(item.asset_code)}
                        <View style={{ marginTop: '3%' }}>
                            <Text style={{ fontSize: RF(4), fontWeight: 'bold', color: '#777777' }}> {item.asset_code} </Text>
                            <Text style={{ fontSize: RF(1.5), color: '#AEAEAE', marginLeft: '5%' }}> {item.created_at}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, marginTop: '3%', alignItems: "flex-end", }}>
                        <Text style={{ fontSize: RF(4), color: item.type_payment == "withdraw" ? "#FF5129" : "#45D25C" }}> {item.type_payment == "withdraw" ? "-" + item.amount : "+" + item.amount} </Text>
                        <Text style={{ fontSize: RF(2), color: '#AEAEAE', marginLeft: '5%' }} numberOfLines={1}> <Icon name={item.type_payment == "withdraw" ? "chevron-with-circle-right" : "chevron-with-circle-left"} type="Entypo" style={{ color: item.type_payment == "withdraw" ? "#FF5129" : "#45D25C", fontSize: RF(2) }} /> {item.transaction_hash}</Text>
                    </View>
                </View>
            </View>
        )
    }

    _renderImageList = (asset_name) => {
        switch (asset_name) {
            case "Jfin":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;
            case "Afin":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;
            case "SBUY":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_dome_white.png?alt=media&token=e6e18755-ade0-487e-ac32-1e793d64f06b" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;
            case "ETH":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_eth_white.png?alt=media&token=8c101f3c-8927-490c-bbb7-1b7fc714a7d4" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;
            case "BTC":
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;

            default:
                return (
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sbuywallet-ce2e7.appspot.com/o/icon%2Fic_btc_white.png?alt=media&token=c1947384-c3c1-4474-8be7-d616ed9e1bd9" }} resizeMode="cover" style={{ width: width * 0.15, height: height * 0.1 }} />
                )
                break;
        }
    }

    listFooter = () => {
        if (this.state.statusLoading) return null;

        return (
            <View style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#CED0CE" }}>
                <Spinner color="#F4511E" size="large" />
            </View>
        );
    }

    handleLoadMore = () => {
        this.setState({
            statusLoading: true,
        }, () => {
            this._getTransaction(this.state.urlGet);
        });
    }

    handleRefresh = () => {
        this.setState({
            dataRespone: [],
            statusRefreshing: true,
            urlGet: "https://api.afin.network/sbuy-api/accounts/" + this.state.dataProfile.key_stellar + "/payments"
        }, () => {
            this._getTransaction(this.state.urlGet);
        })
    }
    //==========================

    render() {
        return (
            <Container>
                <MenuProvider>
                    <View>
                        <View style={{ backgroundColor: "#F0941C", width: width, height: height * 0.4, }}>
                            <View style={{ height: height * 0.07, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20, marginTop: Platform.OS == "ios" ? 10 : 0 }}>
                                <Text style={{ color: "#FFFFFF", fontSize: RF(3.5) }}>SBUY MINING</Text>
                                <Menu>
                                    <MenuTrigger customStyles={triggerStyles} children={<Icon type="Entypo" name="dots-three-vertical" style={{ fontSize: 20, color: "#FFFFFF", alignSelf: 'flex-end' }} />} />
                                    <MenuOptions customStyles={optionStyles}>
                                        {
                                            this.state.dataCrypto.map((item, index) => {
                                                return (
                                                    <MenuOption key={index} onSelect={() => this.onOpen(index)}>
                                                        <Image source={{ uri: item.icon_white }} resizeMode="cover" style={styles.imageMenuPop} />
                                                        <Text style={styles.textMenuPop}>{item.name}</Text>
                                                    </MenuOption>
                                                )
                                            })
                                        }
                                    </MenuOptions>
                                </Menu>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '20%' }}>
                                <Image source={{ uri: this.state.headCoinImage }} resizeMode="contain" style={{ width: width * 0.1, height: height * 0.1 }} />
                                <Text style={{ fontSize: RF(4), fontWeight: 'bold', color: '#FFFFFF' }}> {this.state.headCoinName} </Text>
                            </View>

                            <View style={{ justifyContent: "center", alignItems: 'center' }}>
                                <Text style={{ fontSize: RF(5), fontWeight: 'bold', color: '#FFFFFF' }}> {this.state.headCoinBalance + " " + this.state.headCoinAssetName} </Text>
                                <Text style={{ fontSize: RF(3), color: '#FFFFFF' }}> {this.state.headCoinBalanceUSD} USD </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '3%' }}>
                                {/* <Text style={{ fontSize: RF(2.5), color: '#FFFFFF' }}> **1 BTC = 800 USD** </Text> */}
                                <Text style={{ fontSize: RF(2.5), color: '#FFFFFF' }}> {this.state.headCoinRate}</Text>
                                <Text style={{ fontSize: RF(2.5), color: '#FFFFFF' }}> {this.state.headCoinChange} </Text>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.dataRespone}
                        keyExtractor={(item) => item.id}
                        renderItem={this._renderItem}
                        style={{ flex: 1, marginTop: "-10%" }}
                        ListFooterComponent={this.listFooter}
                        refreshing={this.state.statusRefreshing}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={(Platform.OS === 'ios') ? 0 : 1}
                    />

                    <TabFooter activeTab="home" />
                </MenuProvider>
                <PopupDialog
                    ref={(dialogLoading) => {
                        this.dialogLoading = dialogLoading;
                    }}
                    dialogStyle={ConstStyle.styleLoadingDialogMain}
                    containerStyle={{ zIndex: 10, elevation: 10 }}
                    height={130}
                    width={300}
                    dismissOnTouchOutside={false}
                    dismissOnHardwareBackPress={false}
                    haveOverlay>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Spinner color={Const.COLORMAIN} />
                        <Text style={{ color: Const.COLORMAIN }}>กำลังดำเนินการ...</Text>
                    </View>
                </PopupDialog>
            </Container >
        );
    }
}

const triggerStyles = {
    triggerText: {
        color: 'white',
    },
    triggerWrapper: {
        padding: 5,
        // backgroundColor: 'rgba(244,67,54,1)',
        // alignSelf: 'flex-end',
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const optionStyles = {
    optionWrapper: {
        width: 200,
        marginRight: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionsWrapper: {
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: "rgba(224,224,224 ,1)",
    },
};

const styles = StyleSheet.create({
    viewMain: {
        flex: 1
    },
    imageMenuPop: {
        width: width * 0.05,
        height: height * 0.05,
        marginLeft: '7%'
    },
    textMenuPop: {
        color: '#AEAEAE',
        fontSize: RF(3),
        marginLeft: '7%'
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