import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import './input.css';

//instantiating Cookies class by creating cookies object
const cookies = new Cookies();

const App = () => {
	return (
		<Layout>
			<Login />
		</Layout>
		// <h1 className="text-3xl font-bold underline">Hello world!</h1>
	);
};

export default App;
