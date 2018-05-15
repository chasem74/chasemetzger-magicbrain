import React from 'react';

import './FaceRecognitionResult.css';

class FaceRecognitionResult extends React.Component{
	
	render(){
		const {boxes, imageUrl} = this.props;
		return (
			<div className='center ma'>
				<div className='absolute mt2'>
					<img id='inputImage' src={imageUrl} alt='face images' width='500px' height='auto'/>

					{boxes.map((box, index) => <div key={index} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>)}

				</div>
			</div>
		);
	}
};

export default FaceRecognitionResult;