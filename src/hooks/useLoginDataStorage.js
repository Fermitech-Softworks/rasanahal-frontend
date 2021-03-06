import { useEffect, useState } from 'preact/hooks';
import apiRequest from '../utils/apiRequest';
import { route } from 'preact-router';

export default function() {
	const [instanceUrl, setInstanceUrl] = useState("http://lo.steffo.eu:44445");
	const [loginStatus, setLoginStatus] = useState(null);

	useEffect(() => {
		console.debug("Checking if an instanceUrl is stored in the localStorage...");
		let instanceUrlStore = window.localStorage.getItem("instanceUrl");
		if(instanceUrlStore === null) return;
		console.debug(`Found instanceUrl ${instanceUrlStore}, setting it...`);
		setInstanceUrl(instanceUrlStore);
		console.debug("Checking if a valid login token is stored in the localStorage...");
		let loginStatusStore = JSON.parse(window.localStorage.getItem("loginStatus"));
		if(loginStatusStore === null) return;
		console.debug("Found a login token; checking its validity...");
		apiRequest(instanceUrlStore,  "GET", "/api/token/info/v1", {token: loginStatusStore.token}).then((data => {
			let expiration = new Date(data.expiration);
			console.debug(`Login token expires: ${expiration}`);
			let now = new Date();
			if(expiration >= now ) {
				console.debug(`Login token is valid, logging in...`);
				setLoginStatus(data);
				console.debug(`Successfully logged in as ${data.user.username} @ ${instanceUrlStore} !`);
			}
			else {
				console.debug(`Login token has expired, clearing...`);
				window.localStorage.setItem("loginStatus", null);
			}
		})).catch((err) => {
			console.error(`Could not check validity of the login token: ${err}`)
		})
	}, []);

	function onSuccessfulLogin(newInstanceUrl, newLoginStatus) {
		console.debug(`Successfully logged in as ${newLoginStatus.user.username} @ ${newInstanceUrl} !`);
		setInstanceUrl(newInstanceUrl);
		setLoginStatus(newLoginStatus);
		console.debug("Saving login data in the localStorage...");
		window.localStorage.setItem("instanceUrl", newInstanceUrl);
		window.localStorage.setItem("loginStatus", JSON.stringify(newLoginStatus));
		route("/");
	}

	function requestLogout() {
		console.debug("User requested logout, clearing loginStatus and localStorage...");
		setLoginStatus(null);
		window.localStorage.setItem("loginStatus", null);
		route("/");
	}

	return [instanceUrl, loginStatus, onSuccessfulLogin, requestLogout]
}
