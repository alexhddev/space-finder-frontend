import React, { SyntheticEvent } from "react";
import { AuthService } from "../../services/AuthService";
import history from '../../utils/history'
import './Forms.css';

interface CustomEvent {
    target: HTMLInputElement
}

interface SignUpState {
    userName: string,
    password: string,
    email: string
    confirmPassword: string,
    errorMessage: string,
    confirmationCode: string,
    shouldConfirmAccount: boolean
}
export class SignUp extends React.Component<{
    authService: AuthService
}, SignUpState> {

    state: SignUpState = {
        userName: '',
        password: '',
        email: '',
        confirmPassword: '',
        errorMessage: '',
        confirmationCode: '',
        shouldConfirmAccount: false
    }

    private async confirmSignUp(event: SyntheticEvent){
        event.preventDefault();
        if (this.state.confirmationCode) {
            const result = await this.props.authService.confirmSignUp(
                this.state.userName,
                this.state.confirmationCode
            )
            if (result) {
                history.push('/login')
            } else {
                this.setState({
                    errorMessage: 'Confirmation code wrong!!!'
                })
            }
        } else {
            this.setState({
                errorMessage: 'Please enter the confirmation code'
            })
        }
    }

    private async signUp(event: SyntheticEvent){
        event.preventDefault();
        if (!this.state.confirmPassword ||
            !this.state.email ||
            !this.state.password ||
            !this.state.userName)
            {
                this.setState({
                    errorMessage: 'Please fill all the fields!!!'
                })
        } else if (this.state.password !== this.state.confirmPassword)
        {
            this.setState({
                errorMessage: 'Check passwords fields!'
            })
        } else {
            const result = await this.props.authService.signUp(
                this.state.userName,
                this.state.password,
                this.state.email
            )
            if (result) {
                this.setState({
                    shouldConfirmAccount: true
                })
            } else {
                this.setState({
                    errorMessage: 'There was an error while signing up!!!'
                })
            }
        }
    }

    private setUserName(event: CustomEvent){
        this.setState({userName: event.target.value})
    }

    private setEmail(event: CustomEvent){
        this.setState({email: event.target.value})
    }

    private setPassword(event: CustomEvent){
        this.setState({password: event.target.value})
    }

    private setConfirmPassword(event: CustomEvent){
        this.setState({confirmPassword: event.target.value})
    }

    private setConfirmationCode(event: CustomEvent){
        this.setState({confirmationCode: event.target.value})
    }

    private renderErrorMessage(){
        if (this.state.errorMessage) {
            return <label className='error'> {this.state.errorMessage}</label>
        }
    }
    


    private renderLoginForm(){
        if (this.state.shouldConfirmAccount) {
            return <div>
            <h2>Please register enter the confirmation code:</h2>
            <form onSubmit={e => this.confirmSignUp(e)}>
            <label>Code: </label>
            <input value={this.state.confirmationCode} onChange = {e => this.setConfirmationCode(e)}/>
             <input type='submit' value='Register'/>
            </form>
            {this.renderErrorMessage()}
        </div> 
        } else {
            return <div>
            <h2>Please register</h2>
            <form onSubmit={e => this.signUp(e)}>
            <label>User name: </label>
            <input value={this.state.userName} onChange = {e => this.setUserName(e)}/>
            <label>Email:  </label>
            <input value={this.state.email} onChange = {e => this.setEmail(e)}/>
            <label>Password: </label>
            <input value={this.state.password} onChange = {e => this.setPassword(e)} type='password'/>
            <label>Confirm password: </label>
            <input value={this.state.confirmPassword} onChange = {e => this.setConfirmPassword(e)} type='password'/>
            <input type='submit' value='Register'/>
            </form>
            {this.renderErrorMessage()}
        </div> 
        }
    }

    render(){
            return (
                <div>
                  {this.renderLoginForm()}
                </div>
            )
    }
}