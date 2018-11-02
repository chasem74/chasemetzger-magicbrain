import React from 'react';

import {connect} from 'react-redux';

import {
	Redirect
} from 'react-router-dom';

import * as UserActions from '../../store/actions/user';

class SignOut extends React.Component {

	componentDidMount(){
		this.props.signout(() => {
			//this.props.history.push('/');
		});
	}

	render(){
		return <Redirect to={{pathname: '/signin', from: this.props.location}}/>
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		signout: (callback) => dispatch(UserActions.signout(callback))
	};
};

export default connect(undefined, mapDispatchToProps)(SignOut);