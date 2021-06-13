import { CognitoUser } from '@aws-amplify/auth'


export interface User {
    userName: string,
    cognitoUser: CognitoUser,
    isAdmin: boolean
}

export interface UserAttribute {
    Name: string,
    Value: string
}

export interface Space {
    spaceId: string,
    name: string,
    location: string,
    photoURL?: string,
}

export type ReservationState = 'PENDING' | 'APPROVED' | 'CANCELED'

export interface Reservation {
    reservationId: string,
    user: string,
    spaceId: string,
    state: ReservationState
}