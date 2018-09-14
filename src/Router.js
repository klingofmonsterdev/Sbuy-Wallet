import React from 'react';
import { Router, Stack, Scene, ActionConst, Drawer } from 'react-native-router-flux'

import Pay from './component/Pay';
import Home from './component/Home';
import Login from './component/Login';
import DomePay from './component/DomePay';
import Pincode from './component/Pincode';
import PincodeEdit from './component/PincodeEdit';
import PincodeLogin from './component/PincodeLogin';
import Profile from './component/Profile';
import Exchange from './component/Exchange';


const RouterComponent = (props) => {
    return (
        <Router>
            <Stack key="root">
                <Scene
                    type={ActionConst.RESET}
                    key="Login"
                    component={Login}
                    hideNavBar={true}
                />


                <Scene
                    type={ActionConst.RESET}
                    key="PincodeLogin"
                    component={PincodeLogin}
                    hideNavBar={true}
                />

                <Scene
                    // type={ActionConst.RESET}
                    key="PincodeEdit"
                    component={PincodeEdit}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="Pincode"
                    component={Pincode}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="Home"
                    component={Home}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="Exchange"
                    component={Exchange}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="Pay"
                    component={Pay}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="DomePay"
                    component={DomePay}
                    hideNavBar={true}
                />

                <Scene
                    type={ActionConst.RESET}
                    key="Profile"
                    component={Profile}
                    hideNavBar={true}
                // initial={true}
                />

            </Stack>
        </Router>
    )
}

export default RouterComponent;


