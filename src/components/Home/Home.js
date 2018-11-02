import React from 'react';

import {connect} from 'react-redux';

import Logo from '../Logo/Logo';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm';
import Rank from '../Rank/Rank';
import FaceRecognitionResult from '../FaceRecognitionResults/FaceRecognitionResults';

import * as AuthActions from '../../store/actions/auth_token';
import * as UserActions from '../../store/actions/user';

import * as RouteConstants from '../../common/route_constants';
import * as ApiConstants from '../../common/api_constants';

const initialState = {
	input: '',
	imageUrl: '',
	boxes: [],
};

class Home extends React.Component {

	constructor(props){
		super(props);

		this.state = initialState;
	}

	componentDidMount(){
		this.props.signinWithToken((id) => {
			console.log('alsdjfslfjlfjlsdf');
			if(id){
				this.props.fetchUserById(id);
			}
		});
	}

	calculateFaceLocation = (data) => {
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		const boxes = data.outputs[0].data.regions.map(region => {
			return {
				leftCol: region.region_info.bounding_box.left_col * width,
				topRow: region.region_info.bounding_box.top_row * height,
				rightCol: width - (region.region_info.bounding_box.right_col * width),
				bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
			};
		});

		return boxes;
	}

	setBoxesState = (boxes) => {
		this.setState({boxes: boxes});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onImageSubmit = () => {
		this.setState({imageUrl: this.state.input});
		
		fetch(ApiConstants.BASE_URL + '/imageurl', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
		.then(response => {
			if(response){
				fetch(ApiConstants.BASE_URL + '/image', {
					method: 'put',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState({
						user: {
							...this.state.user,
							entries: count
						}
					});
				});
			}
			this.setBoxesState(this.calculateFaceLocation(response))
		})
		.catch(error => console.log(error));
	}

	render(){
		const {user} = this.props;
		return (
			<div>
				<Logo />
				<Rank name={user.name} entries={user.entries}/>
				<ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
				<FaceRecognitionResult boxes={this.state.boxes} imageUrl={this.state.imageUrl}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authToken: state.session.authToken,
		user: state.session.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		signinWithToken: (callback) => dispatch(UserActions.signinWithToken(callback)),
		setAuthToken: (newToken) => dispatch(AuthActions.setAuthToken(newToken)),
		fetchUserById: (id) => dispatch(UserActions.fetchUserById(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);