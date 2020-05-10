import 'bootstrap/dist/css/bootstrap.min.css';
import './style';
import { useState } from 'preact/hooks';
import InstanceUrl from './contexts/InstanceUrl';
import ONavbar from './components/ONavbar';
import LoginStatus from './contexts/LoginStatus';
import Router from 'preact-router';
import { Container } from 'react-bootstrap';
import LoginAndRegistration from './components/LoginAndRegistration';

export default function() {
	const [instanceUrl, setInstanceUrl] = useState("http://lo.steffo.eu:44445");
	const [loginStatus, setLoginStatus] = useState(null);

	return (
		<InstanceUrl.Provider value={instanceUrl}>
			<LoginStatus.Provider value={loginStatus}>
				<ONavbar/>
				<Container>
					<Router>
						<LoginAndRegistration path={"/login"} setInstanceUrl={setInstanceUrl} setLoginStatus={setLoginStatus}/>
						<div default><span style={"font-family: 'Impact', sans-serif;"}>testo di sopra<br/>testo di sotto</span></div>
					</Router>
				</Container>
			</LoginStatus.Provider>
		</InstanceUrl.Provider>
	);
};
