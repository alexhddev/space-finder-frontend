import { CognitoUser } from '@aws-amplify/auth'


export interface User {
    userName: string,
    cognitoUser: CognitoUser
}

export interface UserAttribute {
    Name: string,
    Value: string
}

export interface Space {
    spaceId: string,
    name: string,
    location: string,
    photoUrl?: string,
}