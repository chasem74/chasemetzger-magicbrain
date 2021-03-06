import React from 'react';
import {connect} from 'react-redux';

import './Profile.css';

import * as UserActions from '../../store/actions/user';
import * as AuthActions from '../../store/actions/auth_token';

class Profile extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			name: this.props.user.name,
			age: this.props.user.name,
			pet: this.props.user.pet
		};
	}

	onFormChange = (event) => {
		switch(event.target.name){
			case 'user-name':
				this.setState({name: event.target.value});
				break;
			case 'user-age':
				this.setState({age: event.target.value});
				break;
			case 'user-pet':
				this.setState({pet: event.target.value});
				break;
			default:
				break;
		}
	}

	onProfileUpdate = (data) => {
		this.props.setUserData({...this.props.user, ...data});
		this.props.toggleModal();
	}

	render(){
		const {user, toggleModal} = this.props;
		const {name, age, pet} = this.state;
		return (
			<div className="profile-modal">
				<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5 bg-white">
					<main className="pa4 black-80 w-80">
						<img
						src="http://tachyons.io/img/logo.jpg"
						className="h3 w3 dib"
						alt="avatar"
						/>
						<h1>{name}</h1>
						<h4>Images submitted: {user.entries}</h4>
						<p>Member since: {new Date(user.joined).toLocaleDateString()}</p>
						<hr />

						<label className="mt2 fw6" htmlFor="user-name">Name: </label>
						<input
						onChange={this.onFormChange}
						className="pa2 ba w-100"
						placeholder={user.name}
						type="text"
						name="user-name"
						id="name"
						/>

						<label className="mt2 fw6" htmlFor="user-age">Age: </label>
						<input
						className="pa2 ba w-100"
						placeholder={user.age}
						type="text"
						name="user-age"
						id="age"
						/>

						<label className="mt2 fw6" htmlFor="user-pet">Pet: </label>
						<input
						className="pa2 ba w-100"
						placeholder={user.pet}
						type="text"
						name="user-pet"
						id="pet"
						/>

						<div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
							<button
							className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
							onClick={() => this.onProfileUpdate({name, age, pet})}
							>
								Save
							</button>
							<button
							className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
							onClick={toggleModal}
							>
								Cancel
							</button>
						</div>
					</main>
					<div className="modal-close" onClick={toggleModal}>&times;</div>
				</article>
			</div>
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
		setAuthToken: (newToken) => dispatch(AuthActions.setAuthToken(newToken)),
		setUserData: (userData) => dispatch(UserActions.setUserData(userData)),
		fetchUserById: (id) => dispatch(UserActions.fetchUserById(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);