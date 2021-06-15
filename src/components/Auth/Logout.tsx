import React from "react";
import { User } from "../../model/Model";
import { AuthService } from "../../services/AuthService";

interface LogoutProps {
    user: User | undefined;
    authService: AuthService;
    clearUser: () => void;
}

interface LogoutState {
    logoutSuccess: string
}

export class Logout extends React.Component<LogoutProps, LogoutState> {

    state: LogoutState = {
        logoutSuccess: ''
    }

    async componentDidMount(){
        if (this.props.user) {
            const result = await this.props.authService.logOut();
            console.log(result)
            this.setState({
                logoutSuccess: 'You are now logged out. You can browse the public parts of this site.'
            })
            this.props.clearUser();
        } else {
            this.setState({
                logoutSuccess: 'You must be logged in to log-out!!!'
            })
        }        
    }

    render(){
            return (
                <div>
                   {this.state.logoutSuccess}
                </div>
            )
    }
}