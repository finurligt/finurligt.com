import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaIcons.FaHome/>,
        className: 'nav-text'
    },
    {
        title: 'Jämför ISK med Aktie & Fondkonto',
        path: '/tool',
        icon: <FaIcons.FaCalculator/>,
        className: 'nav-text'
    },
    {
        title: 'Timetracking',
        path: '/report',
        icon: <AiIcons.AiOutlineBarChart/>,
        className: 'nav-text'
    },
    {
        title: 'Toggl Tool',
        path: '/togglTool',
        icon: <FaIcons.FaWrench/>,
        className: 'nav-text'
    },
    /*
    {
        title: 'Rating Lite',
        path: '/ratingLite',
        icon: <GiIcons.GiRank3/>,
        className: 'nav-text'
    },
    */
]