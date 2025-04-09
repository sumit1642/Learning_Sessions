/* eslint-disable no-unused-vars */
const API = "http://localhost:8000"; // <-- Removed trailing slash to prevent double slashes

import React, { useEffect, useState } from "react";

export const LoginSignupForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState("login");
	const [message, setMessage] = useState("");
	const [account, setAccount] = useState(null);

	const checkSession = async () => {
		try {
			const res = await fetch(`${API}/me`, {
				credentials: "include",
			});
			const data = await res.json();
			if (data.account) {
				setAccount(data.account);
			}
		} catch (error) {
			console.log(`Session check failed `, error);
		}
	};
	// check if already login , use useEffect
	useEffect(() => {
		checkSession();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`${API}/${mode}`, {
				method: "POST",
				// send the cookies with the request , and then verifiy , without this , its impossible to know who is sending the request
				credentials: "include",
				headers: {
					// this tells the server to expect the data as json string
					"Content-Type": "application/json",
				},
				// now here , we are converting the json object retrived from the form and converting it into json string , {"":""}, both side double quotes
				body: JSON.stringify({ username, password }),
			});
			const data = await res.json();

			if (res.ok) {
				setMessage(data.msg);
				setAccount(data.account);
				setUsername("");
				setPassword("");
			}
		} catch (error) {
			console.log(`Something went wrong `, error);
		}
	};

	const handleLogout = async () => {
		await fetch(`${API}/logout`, {
			method: "POST",
			credentials: "include",
		});
		setAccount(null);
		setMessage("Logged out");
	};

	if (account) {
		return (
			<div>
				<h2>Welcome, {account.username}!</h2>
				<button onClick={handleLogout}>Logout</button>
				<p>{message}</p>
			</div>
		);
	}

	return (
		<div>
			<h2>{mode === "login" ? "Login" : "Signup"}</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<br />
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<br />
				<button type="submit">
					{mode === "login" ? "Login" : "Signup"}
				</button>
			</form>
			<button onClick={() => setMode(mode === "login" ? "signup" : "login")}>
				Switch to {mode === "login" ? "Signup" : "Login"}
			</button>
			<p>{message}</p>
		</div>
	);
};
