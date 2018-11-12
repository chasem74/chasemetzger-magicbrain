import React from 'react';

import {
	Link,
	withRouter
} from 'react-router-dom';

import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = withRouter(({isSignedIn, signout, toggleModal, history}) => {
	if(isSignedIn)
	{
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<ProfileIcon signout={signout} history={history} toggleModal={toggleModal}/>
			</nav>
		);
	}else{
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<Link to="/signin" className="f3 link dim black underline pa3 pointer">Sign In</Link>
				<Link to="/register" className="f3 link dim black underline pa3 pointer">Register</Link>
			</nav>
		);
	}
});

export default Navigation;