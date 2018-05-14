import React from 'react';
import Tilt from 'react-tilt';

import brain from './brain.png'
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2 shadow-2' options={{max: 55}} style={{width: 150, height: 150}}>
				<div className='Tilt-inner pa3' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}/*{paddingTop: '5px', width: '125px', height: '125px'}*/} >
					<img alt='brain logo' src={brain} style={{width: '100px', height: '100px'}}/>
				</div>
			</Tilt>
		</div>
	);
};

export default Logo;