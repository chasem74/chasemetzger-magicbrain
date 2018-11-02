import React from 'react';

import {connect} from 'react-redux';

import * as AuthActions from '../../store/actions/auth_token';
import * as UserActions from '../../store/actions/user';

import './SignIn.css';

class SignIn extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			signInEmail: '',
			signInPassword: ''
		};
	}

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value});
	}

	saveAuthTokenInSession = (token) => {
		this.props.setAuthToken(token);
	}

	onSubmitSignIn = () => {
		this.props.signin(this.state.signInEmail, this.state.signInPassword, data => {
			if(data.userId && data.success){
				this.saveAuthTokenInSession(data.token);
				this.props.fetchUserById(data.userId);
				this.props.history.push('/');
			}else{
				console.log(data);
			}
		});
	}

	render(){
		return (
			<article className="form br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
				<main className="pa4 black-80">
					<div className="measure">
						<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
							<legend className="f1 fw6 ph0 mh0">Sign In</legend>
								<div className="mt3">
									<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
									<input
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
									type="email"
									name="email-address"
									id="email-address"
									onChange={this.onEmailChange}/>
								</div>
								<div className="mv3">
									<label className="db fw6 lh-copy f6" htmlu="password">Password</label>
									<input
									className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
									type="password"
									name="password"
									id="password"
									onChange={this.onPasswordChange}/>
								</div>
						</fieldset>
						<div className="">
							<input
							className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
							type="submit"
							value="Sign in"
							onClick={this.onSubmitSignIn}/>
						</div>
						<div className="lh-copy mt3">
							<p onClick={() => this.props.history.push('/register') } className="f6 link dim black db pointer">Register</p>
						</div>
					</div>
				</main>
			</article>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		authToken: state.session.authToken,
		user: state.session.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		signin: (email, password, callback) => dispatch(UserActions.signinWithEmailAndPassword(email, password, callback)),
		setAuthToken: (newToken) => dispatch(AuthActions.setAuthToken(newToken)),
		fetchUserById: (id) => dispatch(UserActions.fetchUserById(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);