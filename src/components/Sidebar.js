import React, { Component } from 'react'
import * as FaIcons from "react-icons/fa"
import { Link } from 'react-router-dom'
import { SidebarData } from './SidebarData';
import './Sidebar.css'
import Login from './Login';
import withAuth from '../contexts/withAuth';


export class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = { sidebar: false };

        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    toggleSidebar() {
        this.setState((state) => ({
            sidebar: !state.sidebar
          }), () => {
              console.log(this.state);
          });
    }

    render() {
        const { auth } = this.props;
        
        return (
            <div>
                <div className="navbar">
                    <Link to="#" className='menu-bars'>
                        <FaIcons.FaBars onClick={this.toggleSidebar} />
                    </Link>
                    {!auth.currentUser
                        ?
                        <Link to="#" className='login' data-toggle="modal" data-target="#modalLoginForm">
                            <p className="font-weight-light mb-0 mr-2">Log in</p>
                        </Link>
                        :
                        <Link to="#" onClick={() => auth.logout()}>
                            <p className="font-weight-light mb-0 mr-2">Log out</p>
                        </Link>
                    }

                </div>
                <nav className={ this.state.sidebar ? 'nav-menu open' : 'nav-menu' } >
                    <ul className='nav-menu-items' >
                        <li className='navbar-toggle' >
                            <Link to='#' className='menu-bars'>
                                <FaIcons.FaWindowClose onClick={ this.toggleSidebar } />
                            </Link>
                        </li>
                        {SidebarData.map((item,index) => {
                            return (
                                <li key={index} className={item.className}>
                                    <Link to={item.path} onClick={ this.toggleSidebar }>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                <Login isOpen="true" onClose="{closeModal}">
                </Login>
            </div>
        )
    }
}

export default withAuth(Sidebar)
