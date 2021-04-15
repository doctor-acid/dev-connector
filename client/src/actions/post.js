import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

//Get Posts
export const getPosts = () => async dispatch => {
    try{
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Like Post
export const addLike = (postId) => async dispatch => {
    try{
        const res = await axios.put(`/api/post/like/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//remove Like
export const removeLike = (postId) => async dispatch => {
    try{
        const res = await axios.put(`/api/post/unlike/${postId}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {postId, likes: res.data}
        })
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Delete post
export const deletePost = (postId) => async dispatch => {
    try{
        const res = await axios.delete(`/api/post/${postId}`);

        dispatch({
            type: DELETE_POST,
            payload: postId
        })
        dispatch(setAlert('Post Removed', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Add post
export const addPost = ({text}) => async dispatch => {
    const body = {
        text
    }
    try{
        const res = await axios.post(`/api/post`, body);

        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Created', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Get Post
export const getPost = (postId) => async dispatch => {
    try{
        const res = await axios.get(`/api/post/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Add Comment
export const addComment = (postId, text) => async dispatch => {
    const body = {
        text
    }
    const config = {
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    try{
        const res = await axios.post(`/api/post/${postId}/comment`, body, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Added Comment', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}

//Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {

    try{
        const res = await axios.delete(`/api/post/${postId}/comment/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Removed Comment', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.statusText, status: e.status}
        })
    }
}