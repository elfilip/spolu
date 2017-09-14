/**
 * Created by elfilip on 10.8.17.
 */

export default function reducer(state = {
profile : null,
loading_profile: null,
    registered: false,
    activationToken: null,
}, action) {
    switch (action.type) {
        case 'GET_USER':
            return {...state, profile: action.profile};
        case "PROFILE_LOADING":
            return {...state, loading_profile: 'loading'}
        case 'PROFILE_LOADED':
            return {...state ,loading_profile: 'complete'}
        case "REGISTER":
            return {...state,registered:true, activationToken:action.activationToken}

    }
    return state;
}