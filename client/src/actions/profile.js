import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILES,
    GET_REPOS
} from './types'

//GET MY PROFILE
export const getCurrentProfile = () => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}

//get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try{
        dispatch({
            type: "LOADING"
        })
        const res = await axios.get('/api/profiles')
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}
//get profile by id
export const getProfileById = (profileId) => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        const res = await axios.get(`/api/profile/${profileId}`)
        console.log(res.data)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch(e){
        console.log(e)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}
//get githubrepos
export const getGitHubRepos = (username) => async dispatch => {
    dispatch({
        type: "LOADING"
    })
    try{
        const res = await axios.get(`/api/profile/github/${username}`)
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}
//Create or Update Profile
export const createProfile = (formData, history, edit=false) => async dispatch =>{
    try{
        dispatch({
            type: "LOADING"
        })
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.post('/api/profile', formData, config)
        console.log(res.data)
        console.log(res.profile)
        dispatch({
            type: GET_PROFILE,
            payload: res.profile
        })

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created' , 'success'));

        if(!edit){
            history.push('/dashboard');
        }
    } catch(e){

        const errors = e.msg || e.message|| e.response.data.errors

        if(errors && Array.isArray(errors)){     //will have to pass errors as an array to continue
            errors.forEach((error)=>{
                console.log(error.msg)
                dispatch(setAlert(error.msg, 'danger'))
            })
        } else if(errors){
            dispatch(setAlert(errors, 'danger'))
        }
        console.log(e)
        console.log(e.data)
        console.log(e.response)
        console.log(e.status)
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response, status: e.response.status}
        })
    }
}

//Add experience
export const addExperience = (formData, history) => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.put('/api/profile/experience', formData, config)
        console.log(res)
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Added' , 'success'));


        history.push('/dashboard');
    } catch(e){
        console.log(e)
        const errors = e.msg || e.message || e.response.data.errors 

        if(errors && Array.isArray(errors)){     //will have to pass errors as an array to continue
            errors.forEach((error)=>{
                console.log(error.msg)
                dispatch(setAlert(error.msg, 'danger'))
            })
        } else if(errors){
            dispatch(setAlert(errors, 'danger'))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}

//add EDUCaTION
export const addEducation = (formData, history) => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.put('/api/profile/education', formData, config)
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Added' , 'success'));

        history.push('/dashboard');

    } catch(e){

        const errors = e.msg || e.message || e.response.data.errors

        if(errors && Array.isArray(errors)){     //will have to pass errors as an array to continue
            errors.forEach((error)=>{
                console.log(error.msg)
                dispatch(setAlert(error.msg, 'danger'))
            })
        } else if(errors){
            dispatch(setAlert(errors, 'danger'))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e, status: e.status}
        })
    }
}

// DElete experience
export const deleteExperience = (id) => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        console.log('wtf bro')
        const res = await axios.delete(`/api/profile/experience/${id}`)
        
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Removed', 'success'))
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg : e, status: e.status}
        })
    }
}

// DElete education
export const deleteEducation = (id) => async dispatch => {
    try{
        dispatch({
            type: "LOADING"
        })
        const res = await axios.delete(`/api/profile/education/${id}`)
        console.log('ky re ed')
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Removed', 'success'))
    } catch(e){
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg : e, status: e.status}
        })
    }
}

// DElete account
export const deleteAccount = (id) => async dispatch => {
    if(window.confirm('Are you sure? this cannot be undone!')){
        try{
            await axios.delete(`/api/profile/me`)
            
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: ACCOUNT_DELETED })
            dispatch(setAlert('Account Deleted', 'success'))
        } catch(e){
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg : e, status: e.status}
            })
        }
    }
}