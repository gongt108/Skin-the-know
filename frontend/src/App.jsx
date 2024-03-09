import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './components/auth/Login';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

const App = () => {
	return (
		<Layout>
			<Login />
		</Layout>
	);
};

export default App;
