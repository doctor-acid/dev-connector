import React, {Fragment,useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({getCurrentProfile, deleteAccount, auth:{user}, profile:{profile, loading}}) => {
    useEffect(()=>{
        getCurrentProfile();
    }, []);
    useEffect(()=>{
        console.log(profile)
        setProfile(profile)
    },[profile])

    const [Profile, setProfile] = useState(null)

    return !Profile ? (<Spinner />) : (<Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user.name}
        </p>
        {profile ? (<Fragment>
            <DashboardActions/>
            <Experience experience= {profile.experience} />
            <Education education= {profile.education} />
            <div className="my-2">
                <button className="btn btn-danger" onClick={()=>{deleteAccount()}}>
                    Delete Account
                </button>
            </div>
        </Fragment>) : (<Fragment>
            <p>You have not yet created a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
        </Fragment>)
        }
    </Fragment>
)}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state)=>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)