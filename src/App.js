import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognitionResults from './components/FaceRecognitionResults/FaceRecognitionResults';

import './App.css';

const CLARIFAI_API_KEY = "f032556c971b4b29ba83f3a6dad2d904";

const clarifaiApp = new Clarifai.App({
	apiKey: CLARIFAI_API_KEY
});

const particleOptions = {
	particles: {
		number:{
			value: 100,
		
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
};

class App extends Component {
	constructor(){
		super();

		this.state = {
			input: '',
			imageUrl: ''
		};
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
			function(response) {
				console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
			},

			function(error) {
				console.log(error);
			}
		);
	}

	render() {
		return (
			<div className="App">
				<Particles className='particles' style={{width: '100%', height: '100%'}} params={particleOptions} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
				<FaceRecognitionResults imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;