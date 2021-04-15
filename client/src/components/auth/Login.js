import React, {Fragment, useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {login } from '../../actions/auth'
import { setAlert } from '../../actions/alert'

const Login = ({isAuthenticated, login, setAlert}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const {email, password} = formData;
    
    const onChange = (e)=> setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async (e)=> {
        e.preventDefault();
        console.log('Success')
        login(email, password)
    }

    //redirect if logged in
    if(isAuthenticated === true){
        setAlert('Logged in', 'success')
        return <Redirect to="/dashboard"/>
    }
    return(
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> Login to Your Account</p>
                <form className="form" onSubmit={e=>onSubmit(e)}>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=>onChange(e)}/>
                    </div>
                        <input type="password" placeholder="Password" name="password" value={password} onChange={e=>onChange(e)}/>
                    <div className="form-group">
                        <input type="submit" className="btn btn-primary" value="Login" />
                    </div>
                </form>
                <p className="my-1">
                    Dont have an account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login, setAlert })(Login);