import { useState } from "react"
import NotificationPanel from "../../notificationpanel/NotificationPanel"
import './top_bar.css'
import { HiddenSearchBar } from "../search_bar/search_bar"

function TopBarCentralText ({text}:{text:string}) {

	return (
		<>
		<div className="top-bar-central-text">
			<div className="top-bar">
				<div className="logo">
					S&C
				</div>
				<div className="top-central-text">{text}</div>
				<div className="right-group">
                    <HiddenSearchBar></HiddenSearchBar>
                    <NotificationPanel></NotificationPanel>
					<i className="material-icons">person</i>
				</div>
			</div>
		</div>
		</>
	)
}

export default TopBarCentralText