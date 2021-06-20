import { User, UserAttribute } from '../model/Model'
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import { config } from './config';
import { CognitoUser } from '@aws-amplify/auth'
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk/lib/credentials';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: config.REGION,
        userPoolId: config.USER_POOL_ID,
        userPoolWebClientId: config.APP_CLIENT_ID,
        identityPoolId: config.IDENTITY_POOL_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})


export class AuthService {

    public async confirmSignUp(username: string, code: string):Promise<any | undefined>{
        try {
            const result = await Auth.confirmSignUp(username, code);
            return result
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async signUp(username: string, password: string, email: string):Promise<CognitoUser | undefined>{
        try {
            const result = await Auth.signUp({
                username,
                password,
                attributes: {
                    email
                }
            });
            return result.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async login(userName: string, password: string): Promise<User | undefined>{
        try {
            const user = await Auth.signIn(userName, password) as CognitoUser;
            return {
                cognitoUser: user,
                userName: user.getUsername(),
                isAdmin: false
            };
        } catch (error) {
            return undefined
        }
    }

    public async logOut(){
        return await Auth.signOut();
    }

    public async getAWSTemporaryCreds(user: CognitoUser){
        const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`; 
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.IDENTITY_POOL_ID,
            Logins: {
                [cognitoIdentityPool]: user.getSignInUserSession()!.getIdToken().getJwtToken()
            }
        }, {
            region: config.REGION
        });
        await this.refreshCredentials();
     }
 
 
     private async refreshCredentials(): Promise<void>{
         return new Promise((resolve, reject)=>{
             (AWS.config.credentials as Credentials).refresh(err =>{
                 if (err) {
                     reject(err)
                 } else {
                     resolve()
                 }
             })
         })
     }

    public async getUserAttributes(user: User):Promise<UserAttribute[]>{
        const result: UserAttribute[] = [];
        const attributes = await Auth.userAttributes(user.cognitoUser);
        result.push(...attributes);
        return result
    }

    public async updateProfilePicture(user: User, pictureUrl: string){
        await this.updateUserAttribute(user, {
            picture: pictureUrl
        })
    }

    private async updateUserAttribute(user: User, attribute: {
        [key: string]: string
    }) {
        await Auth.updateUserAttributes(user.cognitoUser, attribute)
    }

    public isUserAdmin(user: User): boolean{
        const session = user.cognitoUser.getSignInUserSession();
        if (session) {
            const idTokenPayload = session.getIdToken().decodePayload();
            const cognitoGroups = idTokenPayload['cognito:groups'];
            if (cognitoGroups) {
                return (cognitoGroups as string).includes('admins')
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}