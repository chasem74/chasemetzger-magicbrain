import React from 'react';

import {connect} from 'react-redux';

import * as ApiConstants from '../../common/api_constants';
import * as AuthActions from '../../store/actions/auth_token';
import * as UserActions from '../../store/actions/user';

class Register extends React.Component {
	
	constructor(props){
		super(props);

		this.state = {
			email: '',
			password: '',
			name: '',
			errorData: {
				failedToRegister: false,
				message: ''
			}
		};
	}

	onEmailChange = (event) => {
		this.setState({email: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({password: event.target.value});
	}

	onNameChange = (event) => {
		this.setState({name: event.target.value});
	}

	onSubmit = () => {
		fetch(ApiConstants.BASE_URL + '/register', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				name: this.state.name
			})
		})
		.then(response => response.json())
		.then(user => {
			if(user.id){
				this.props.signin(this.state.email, this.state.password, (data) => {
					if(data.userId && data.success){
						this.props.setAuthToken(data.token);
						this.props.fetchUserById(data.userId);
						this.props.history.push('/');
						//this.props.onRouteChange('home');
					}else{
						this.setState({
							errorData:{
								failedToRegister: true,
								message: 'Unable to register'
							}
						});
					}
				});
				this.props.fetchUserById()
			}else{
				this.setState({
					errorData:{
						failedToRegister: true,
						message: 'Unable to register'
					}
				});
			}
		});
	}

	render(){
		return (
			<article className="form br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
				<main className="pa4 black-80">
					<div className="measure">
						<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
							<legend className="f1 fw6 ph0 mh0">Register</legend>
							{
								this.state.errorData.failedToRegister ?
									<p className='ba b--transparent red'>{this.state.errorData.message}</p>
									: <p></p>
							}

								<div className="mt3">
									<label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
									<input
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="text"
									name="name"
									id="name"
									onChange={this.onNameChange}/>
								</div>
								<div className="mt3">
									<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
									<input
									className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
									type="email"
									name="email-address"
									id="email-address"
									onChange={this.onEmailChange}/>
								</div>
								<div className="mv3">
									<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
									<input
									className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
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
							value="Register"
							onClick={this.onSubmit}/>
						</div>
					</div>
				</main>
			</article>
		);
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		signin: (email, password, callback) => dispatch(UserActions.signinWithEmailAndPassword(email, password, callback)),
		setAuthToken: (newToken) => dispatch(AuthActions.setAuthToken(newToken)),
		fetchUserById: (id) => dispatch(UserActions.fetchUserById(id))
	};
}

export default connect(undefined, mapDispatchToProps)(Register);