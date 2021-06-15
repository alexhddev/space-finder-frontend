import React, { SyntheticEvent } from "react";
import { User } from "../../model/Model";
import { AuthService } from "../../services/AuthService";
import history from '../../utils/history'



interface LoginProps {
    authService: AuthService,
    setUser:(user: User) => void
}
interface LoginState {
    userName: string,
    password: string,
    loginStatusMessage: string
}

interface CustomEvent {
    target: HTMLInputElement
}

export class Login extends React.Component<LoginProps, LoginState> {

    state: LoginState = {
        userName: '',
        password: '',
        loginStatusMessage: ''
    }

    private setUserName(event: CustomEvent){
        this.setState({userName: event.target.value})
    }

    private setPassword(event: CustomEvent){
        this.setState({password: event.target.value})
    }
    
    private async handleSubmit(event: SyntheticEvent){
        event.preventDefault();
        const result = await this.props.authService.login(
            this.state.userName,
            this.state.password
        )
        if (result) {
            this.props.setUser(result)
            history.push('/profile')
        } else {
            this.setState({loginStatusMessage: 'Login failed. Please check your credentials'})
        }
    }

    private renderLoginForm(){
        return <div>
                <h2>Please login</h2>
                <form onSubmit={e => this.handleSubmit(e)}>
                    <input value={this.state.userName} onChange = {e => this.setUserName(e)}/><br/>
                    <input value={this.state.password} onChange = {e => this.setPassword(e)} type='password'/><br/>
                    <input type='submit' value='Login'/>
                </form>
                {this.state.loginStatusMessage}<br></br>
        </div>
    }




    render(){

        return (
            <div>
                {this.renderLoginForm()}
            </div>
        )
    }
}