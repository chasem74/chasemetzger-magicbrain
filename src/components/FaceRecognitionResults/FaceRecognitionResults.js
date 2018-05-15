import React from 'react';

const FaceRecognitionResults = ({imageUrl}) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img src={imageUrl} alt='face images' width='500px' height='auto'/>
			</div>
		</div>
	);
};

export default FaceRecognitionResults;