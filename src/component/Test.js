import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Container, Icon, Button, Input, Item } from 'native-base';
import Spinners from 'react-native-spinkit';

import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import RF from 'react-native-responsive-fontsize';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import { connectApi, alertOops } from './constants/Function';
import ConstStyle from './constants/ConstStyle';
import TabFooter from './common/TabFooter';
import Validate from './common/Validate';
import Database from './database/DbUser';
import Const from './constants/Const';

const Device = require('react-native-device-detection');
const { width, height } = Dimensions.get('window');

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.viewMain}>
                    <MenuProvider>
                        <Text style={{
                            fontSize: RF(3.5),
                            color: "#777777",
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>1 ETH = 100 SBUY Test</Text>
                        <View style={{ width: "100%", height: height * 0.3, backgroundColor: "#707BCC", marginTop: "5%", justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                            <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                                <MenuTrigger customStyles={triggerStyles} children={<Text style={{
                                    fontSize: RF(3),
                                    color: "#FFFFFF",
                                    textShadowColor: 'rgba(0, 0, 0,0.16)',
                                    textShadowOffset: { width: 0, height: 3 },
                                    textShadowRadius: 6,
                                    elevation: 6,
                                }}>Ethereum <Icon type="Entypo" name="chevron-small-down" style={{ fontSize: RF(3), color: "#FFFFFF" }} /></Text>} />
                                <MenuOptions customStyles={optionStyles}>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Bitcoin</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_eth_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Ethereum</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_dome_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Sbuy</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_ltc_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Litecoin</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                            <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={{ width: width * 0.25, height: height * 0.15 }} />
                            <Text style={{ color: "#FFFFFF", fontSize: RF(2) }}>คงเหลือ 2.1119 ETH</Text>
                        </View>

                        <View style={{ width: "100%", height: height * 0.1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button style={{ alignSelf: "center", marginRight: "2.5%", backgroundColor: "#45D25C", borderRadius: 8 }} onPress={() => this.popupDialogUp.show()}><Icon name="md-arrow-round-up" type="Ionicons" /></Button>
                            <Button style={{ alignSelf: "center", marginLeft: "2.5%", backgroundColor: "#FF5129", borderRadius: 8 }} onPress={() => this.popupDialogDown.show()}><Icon name="md-arrow-round-down" type="Ionicons" /></Button>
                        </View>

                        <View style={{ width: "100%", height: height * 0.3, backgroundColor: "#32BEDE", justifyContent: "center", alignItems: "center", borderRadius: 8 }}>
                            <Menu onSelect={value => alert(`Selected number: ${value}`)}>
                                <MenuTrigger customStyles={triggerStyles} children={<Text style={{
                                    fontSize: RF(3),
                                    color: "#FFFFFF",
                                    textShadowColor: 'rgba(0, 0, 0,0.16)',
                                    textShadowOffset: { width: 0, height: 3 },
                                    textShadowRadius: 6,
                                    elevation: 6,
                                }}>Ethereum <Icon type="Entypo" name="chevron-small-down" style={{ fontSize: RF(3), color: "#FFFFFF" }} /></Text>} />
                                <MenuOptions customStyles={optionStyles}>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Bitcoin</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_eth_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Ethereum</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_dome_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Sbuy</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => this.onOpen()}>
                                        {/* <Image source={require('../../assets/ic_ltc_white.png')} resizeMode="cover" style={styles.imageMenuPop} /> */}
                                        <Text style={styles.textMenuPop}>Litecoin</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                            <Image source={require('../../assets/ic_btc_white.png')} resizeMode="cover" style={{ width: width * 0.25, height: height * 0.15 }} />
                            <Text style={{ color: "#FFFFFF", fontSize: RF(2) }}>คงเหลือ 2.1119 ETH</Text>
                        </View>
                    </MenuProvider>
                </View>

                <TabFooter activeTab="exchange" />

                <PopupDialog
                    ref={(popupDialog) => { this.popupDialogUp = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    width={0.8}
                    height={0.6}
                    hasOverlay={true}
                    dismissOnTouchOutside={false}
                >
                    {/* <View>
                        <View style={{ padding: "2.5%", alignItems: 'flex-end' }}>
                            <Icon onPress={() => this.popupDialogUp.dismiss()} type="Ionicons" name="md-close-circle" style={{ fontSize: RF(4), color: "#58A3EA" }} />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/sent-currency-icon.png')} resizeMode="cover" style={{ width: width * 0.28, height: height * 0.18 }} />
                            <Text style={{
                                fontSize: RF(3), color: "#777777",
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                marginTop: "5%"
                            }}>แปลง BTC เป็น SBUY</Text>
                        </View>
                        <View style={{ paddingLeft: "4%", paddingRight: '4%' }}>
                            <Text style={{
                                fontSize: RF(2),
                                color: "#777777",
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                marginTop: "5%"
                            }}>จำนวน</Text>
                            <Item regular style={{ marginTop: "5%" }}>
                                <Input />
                                <Text>BTC</Text>
                            </Item>
                            <Button block success style={{ marginTop: "5%" }}>
                                <Text>ยืนยัน</Text>
                            </Button>
                            <Text style={{
                                fontSize: RF(1.8),
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                color: "#FF5129",
                                marginTop: "5%"
                            }}>*กรุณาอย่าปิดหน้าต่างนี้ลง จนกว่าจะทำรายการสำเร็จ</Text>
                        </View>
                    </View> */}

                    {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: "10%" }}>
                        <Spinners
                            isVisible={true}
                            color="rgba(69, 210, 92,0.31)"
                            size={150}
                            type="FadingCircleAlt"
                        />
                        <Text style={{
                            fontSize: RF(4),
                            color: "#777777",
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>กำลังทำรายการ...</Text>
                        <Button block style={{
                            marginTop: "5%",
                            backgroundColor: "#AEAEAE",
                            borderRadius: 8,
                            shadowColor: "rgba(0, 0, 0,0.16)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1.5,
                            elevation: 8
                        }} disabled>
                            <Text style={{ color: "#FFFFFF" }}>ยืนยัน</Text>
                        </Button>
                    </View> */}

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: "10%" }}>
                        <Icon name="ios-checkmark-circle-outline" type="Ionicons" style={{ fontSize: RF(35), color: "#45D25C" }} />
                        <Text style={{
                            fontSize: RF(4),
                            color: "#777777",
                            textShadowColor: 'rgba(0, 0, 0,0.16)',
                            textShadowOffset: { width: 0, height: 3 },
                            textShadowRadius: 6,
                            elevation: 6,
                        }}>ทำรายการสำเร็จ!</Text>
                        <Button block style={{
                            marginTop: "5%", 
                            backgroundColor: "#45D25C", 
                            borderRadius: 8, 
                            shadowColor: "rgba(0, 0, 0,0.16)",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 1.5,
                            elevation: 8
                        }}>
                            <Text style={{ color: "#FFFFFF" }}>ตกลง</Text>
                        </Button>
                    </View>
                </PopupDialog>

                <PopupDialog
                    ref={(popupDialog) => { this.popupDialogDown = popupDialog; }}
                    dialogAnimation={slideAnimation}
                    width={0.8}
                    height={0.6}
                    hasOverlay={true}
                    dismissOnTouchOutside={false}
                >
                    <View>
                        <View style={{ padding: "2.5%", alignItems: 'flex-end' }}>
                            <Icon onPress={() => this.popupDialogDown.dismiss()} type="Ionicons" name="md-close-circle" style={{ fontSize: RF(4), color: "#58A3EA" }} />
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../../assets/sent-currency-icon.png')} resizeMode="cover" style={{ width: width * 0.28, height: height * 0.18 }} />
                            <Text style={{
                                fontSize: RF(3), color: "#777777",
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                marginTop: "5%"
                            }}>แปลง SBUY เป็น BTC</Text>
                        </View>
                        <View style={{ paddingLeft: "4%", paddingRight: '4%' }}>
                            <Text style={{
                                fontSize: RF(2),
                                color: "#777777",
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                marginTop: "5%"
                            }}>จำนวน</Text>
                            <Item regular style={{ marginTop: "5%" }}>
                                <Input />
                                <Text>BTC</Text>
                            </Item>
                            <Button block success style={{ marginTop: "5%" }}>
                                <Text>ยืนยัน</Text>
                            </Button>
                            <Text style={{
                                fontSize: RF(1.8),
                                textShadowColor: 'rgba(0, 0, 0,0.16)',
                                textShadowOffset: { width: 0, height: 3 },
                                textShadowRadius: 3,
                                elevation: 3,
                                color: "#FF5129",
                                marginTop: "5%"
                            }}>*กรุณาอย่าปิดหน้าต่างนี้ลง จนกว่าจะทำรายการสำเร็จ</Text>
                        </View>
                    </View>
                </PopupDialog>
            </ScrollView>
        );
    }
}

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

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
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: "5%"
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
});