import React from 'react';
import { User  } from '../model/Model'
import { AuthService } from '../services/AuthService'
import { Login } from './Auth/Login';
import { Logout } from './Auth/Logout';
import { Router, Route, Switch } from 'react-router-dom'
import history from '../utils/history';
import { Navbar } from './Navbar';
import { Home } from './Home';
import { Profile } from './Profile';
import { Spaces } from './spaces/Spaces'
import { DataService } from '../services/DataService';
import { CreateSpace } from './spaces/CreateSpace';
import { Reservations } from './reservations/Reservations';
import { SignUp } from './Auth/Signup';

interface AppState{
  user: User | undefined
}

/* istanbul ignore file */
export class App extends React.Component<{}, AppState>{

  private authService: AuthService = new AuthService();
  private dataService: DataService = new DataService();

  constructor(props: any){
    super(props)
    this.state = {
      user: undefined
    }

    this.setUser = this.setUser.bind(this);
    this.clearUser = this.clearUser.bind(this);
  }

  private clearUser(){
    this.setState({
      user: undefined
    });
  }

  private async setUser(user: User){
    const isAdmin = this.authService.isUserAdmin(user);
    if (isAdmin) {
      user.isAdmin = true;
    }
    this.setState({
      user: user
    })
    this.dataService.setUser(user);
    await this.authService.getAWSTemporaryCreds(user.cognitoUser);
  }


  render(){
    return (
      <div className='wrapper'>
        <Router history={history}>
          <div>
            <Navbar user={this.state.user}/>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route exact path='/login'>
                <Login authService={this.authService} setUser={this.setUser}/>
              </Route>
              <Route exact path='/profile'>
                <Profile authService={this.authService} user={this.state.user} dataService={this.dataService}/>
              </Route>
              <Route exact path='/spaces'>
                <Spaces dataService={this.dataService} user={this.state.user}/>
              </Route>
              <Route exact path='/createSpace'>
                <CreateSpace dataService={this.dataService}/>
              </Route>
              <Route exact path='/reservations'>
                <Reservations dataService={this.dataService} user={this.state.user}/>
              </Route>
              <Route exact path='/logout'>
                <Logout user={this.state.user} authService={this.authService} clearUser={this.clearUser}/>
              </Route>
              <Route exact path='/signup'>
                <SignUp authService={this.authService}/>
              </Route>
            </Switch>
          </div>

        </Router>
      </div>
    )
  }
}