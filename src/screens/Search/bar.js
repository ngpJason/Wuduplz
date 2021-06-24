import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import All from "./index";
import Like from './like'
import Create from './create'

const SideTab = createMaterialTopTabNavigator();

const TabBar = ({route, navigation}) => {
    return (
        <SideTab.Navigator>
            <SideTab.Screen name="All" component={All} options={{ tabBarLabel: 'All Videos' }} />
            <SideTab.Screen name="Like" component={Like} options={{ tabBarLabel: 'Liked by me' }} />
            <SideTab.Screen name="Create" component={Create} options={{ tabBarLabel: 'Created by me' }} />
        </SideTab.Navigator>
    )
};

export default TabBar;