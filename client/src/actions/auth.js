import axios from 'axios';
import { 
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {

    if(localStorage.token){
        setAuthToken(localStorage.token)
    }

    try{
        const res = await axios.get('/api/auth');
        
        dispatch({
            type: USER_LOADED,
            payload: res.data.user
        })
    } catch(e){
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//register user
export const register = ({ name, email, password}) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ name, email, password})
    try{
        const res = await axios.post('/api/users', body, config)    
        //http://127.0.0.1:3005

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })

        dispatch(loadUser())
    }catch(e){
        console.log(e.response)
        const errors = e.response.data.errors

        if(errors && Array.isArray(errors)){     //will have to pass errors as an array to continue
            errors.forEach((error)=>{
                console.log(error.msg)
                dispatch(setAlert(error.msg, 'danger'))
            })
        } else if(errors){
            dispatch(setAlert(errors, 'danger'))
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }

}

//login user
export const login = ( email, password) => async dispatch =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({email, password})
    try{
        const res = await axios.post('/api/users/login', body, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    }catch(e){

        // const errors = e
        // console.log(errors)

        // if(errors && Array.isArray(errors)){     //will have to pass errors as an array to continue
        //     errors.forEach((error)=>{
        //         console.log(error)
        //         dispatch(setAlert(error.msg, 'danger'))
        //     })
        // } else if(errors){
        //     dispatch(setAlert(errors, 'danger'))
        // }
        dispatch({
            type: LOGIN_FAIL
        })
    }

}

//LOGOUT

export const logout = () => dispatch =>{
    dispatch({type: CLEAR_PROFILE})
    dispatch({type: LOGOUT})
}