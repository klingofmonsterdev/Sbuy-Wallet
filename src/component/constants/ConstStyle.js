import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
const { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    backgroundLogin: {
        width: '100%',
         height: '100%',
    },
    viewCenter: {
        flex: 1,
        marginLeft: 30,
        marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    styleLoadingDialogMain: {
        backgroundColor: 'rgba(245,245,245 ,1)',
    },
    styleLoadingDialogText: {
        color: '#F4511E'
    },

});