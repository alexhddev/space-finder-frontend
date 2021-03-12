import React from "react";
import { User } from "../model/Model";
import { Link } from 'react-router-dom'



export class Navbar extends React.Component<{
    user: User | undefined
}> {

    render(){
        let loginLogOut: any
        if (this.props.user) {
            loginLogOut = <Link to='/logout'>{this.props.user.userName}</Link>
        } else {
            loginLogOut = <Link to='/login'>Login</Link>
        }


        return(
            <div className='navbar'>
                <Link to='/'> Home</Link>
                <Link to='/profile'> Profile</Link>
                {loginLogOut}
            </div>
        )
    }
}