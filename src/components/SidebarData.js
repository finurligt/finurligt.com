import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaIcons.FaHome/>,
        className: 'nav-text'
    },
    {
        title: 'Some tool idk',
        path: '/tool',
        icon: <FaIcons.FaCalculator/>,
        className: 'nav-text'
    },
    {
        title: 'Some report idk',
        path: '/report',
        icon: <AiIcons.AiOutlineBarChart/>,
        className: 'nav-text'
    }
]