import { User, UserAttribute } from '../model/Model'
import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import { config } from './config';
import { CognitoUser } from '@aws-amplify/auth'

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

    public async login(userName: string, password: string): Promise<User | undefined>{
        try {
            const user = await Auth.signIn(userName, password) as CognitoUser;
            return {
                cognitoUser: user,
                userName: user.getUsername()
            };
        } catch (error) {
            return undefined
        }

    }

    public async getUserAttributes(user: User):Promise<UserAttribute[]>{
        const result: UserAttribute[] = [];
        const attributes = await Auth.userAttributes(user.cognitoUser);
        result.push(...attributes);
        return result
    }
}