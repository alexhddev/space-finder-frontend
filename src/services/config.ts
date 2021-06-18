

const spacesUrl = 'https://v1brla82hd.execute-api.eu-west-1.amazonaws.com/prod/'

export const config = {
    REGION: 'eu-west-1',
    USER_POOL_ID: 'eu-west-1_gRIUoOdLx',
    APP_CLIENT_ID: '335vma5jmludo42mn2895cu5bh',
    IDENTITY_POOL_ID: 'eu-west-1:c1490135-4dd2-4a82-9959-880f77fef599',
    SPACES_PHOTOS_BUCKET: 'spaces-photos-02380a0ccf21',
    PROFILE_PHOTOS_BUCKET: 'profile-photos-02380a0ccf21',
    api: {
        baseUrl: spacesUrl,
        spacesUrl: `${spacesUrl}spaces/`,
        reservationsUrl: `${spacesUrl}reservations/`
    }
}