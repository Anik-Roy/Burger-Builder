import * as actionTypes from './actionTypes';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            token: token,
            userId: userId,
        }
    }
}

export const authLoading = isLoading => {
    return {
        type: actionTypes.AUTH_LOADING,
        payload: isLoading,
    }
}

export const authFailed = errMsg => {
    return {
        type: actionTypes.AUTH_FAILED,
        payload: errMsg,
    }
}

const storeLocally = token => {
    const decoded = jwt_decode(token);
    const expTime = decoded.exp;
    const userId = decoded.user_id;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    const expirationTime = new Date(expTime * 1000);
    localStorage.setItem('expirationTime', expirationTime);

    return userId;
}

export const auth = (email, password, mode) => dispatch => {
    dispatch(authLoading(true));
    const authData = {
        email: email,
        password: password,
    }

    const header = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let authUrl = null;

    if(mode === "Sign up") {
        authUrl = 'http://127.0.0.1:8000/api/user/';
    } else {
        authUrl = 'http://127.0.0.1:8000/api/token/';
    }

    axios.post(authUrl, authData, header)
    .then(response => {
        dispatch(authLoading(false));
        if(mode !== 'Sign up') {
            const token = response.data.access;
            
            const userId = storeLocally(token);

            dispatch(authSuccess(token, userId));
        } else {
            dispatch(authLoading(true));
            return axios.post('http://127.0.0.1:8000/api/token/', authData, header)
            .then(response => {
                const token = response.data.access;
            
                const userId = storeLocally(token);

                dispatch(authSuccess(token, userId));
            })
        }
        console.log(jwt_decode(response.data.access));
    })
    .catch(error => {
        const key = Object.keys(error.response.data)[0];
        console.log(error.response.data[key]);

        dispatch(authLoading(false));
        dispatch(authFailed(error.response.data[key]));
    });
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationTime');
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const authCheck = () => dispatch => {
    const token = localStorage.getItem('token');
    if(!token) {
        // logout
        dispatch(logout());
    } else {
        const expirationTime = new Date(localStorage.getItem('expirationTime'));
        if(expirationTime <= new Date()) {
            // logout
            dispatch(logout());
        } else {
            const userId = localStorage.getItem('userId');
            dispatch(authSuccess(token, userId));
        }
    }
}