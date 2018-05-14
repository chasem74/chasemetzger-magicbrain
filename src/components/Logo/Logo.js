import React from 'react';
import Tilt from 'react-tilt';

import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2 shadow-2' options={{max: 55}} style={{width: 150, height: 150}}>
				<div className='Tilt-inner'>Hello</div>
			</Tilt>
		</div>
	);
};

export default Logo;