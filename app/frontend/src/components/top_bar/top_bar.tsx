import "../../main.css"
import SearchBar from "../search_bar/search_bar";
import NotificationPanel from "../../notificationpanel/NotificationPanel";
import { useState } from "react";

export function TopBar () {
	const [notificationsVisible, setNotificationVisible] = useState(true);
	
	function toggle_notifications() {
		setNotificationVisible(!notificationsVisible);
		if (!notificationsVisible) {return;}
	}
	
    return (
        <>
			<div className="top_bar">
				<div className="top-bar">
					<div className="logo">
						S&C
					</div>
					<SearchBar></SearchBar>
					<div className="right-group">
						<i className="material-icons" onClick={() => toggle_notifications()}>notifications_none</i>
						<i className="material-icons">person</i>
					</div>
				</div>
			</div>
			{NotificationPanel(notificationsVisible)}
        </>
    )
}

export function TopBarCentralText ({text}:{text:string}) {
	return (
		<>
		<div className="top_bar">
			<div className="top-bar">
				<div className="logo">
					S&C
				</div>
				<div className="top-central-text">{text}</div>
				<div className="right-group">
					<i className="material-icons">search</i>	
					<i className="material-icons">notifications_none</i>
					<i className="material-icons">person</i>
				</div>
			</div>
		</div>
		</>
	)
}

