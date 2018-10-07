const SIGNIN_ROUTE = 'signin';
const SIGNOUT_ROUTE = 'signout';
const HOME_ROUTE = 'home';
const REGISTER_ROUTE = 'register';

const BASE_PRODUCTION_URL = 'https://aqueous-eyrie-86125.herokuapp.com';
const BASE_DEVELOPMENT_URL = 'http://localhost:3000';
let BASE_URL = null;
if(process.env.NODE_ENV === 'developement'){
	BASE_URL = BASE_DEVELOPMENT_URL;
}else{
	BASE_URL = BASE_PRODUCTION_URL;
}


const Constants = {
	BASE_URL,
	SIGNIN_ROUTE,
	SIGNOUT_ROUTE,
	HOME_ROUTE,
	REGISTER_ROUTE,
};

export default Constants;