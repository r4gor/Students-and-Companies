import { useState } from "react"
import NotificationPanel from "../../notificationpanel/NotificationPanel"

function TopBarCentralText ({text}:{text:string}) {
    const [search_bar_open, setSearchBarOpen] = useState(false)

	return (
		<>
		<div className="top_bar">
			<div className="top-bar">
				<div className="logo">
					S&C
				</div>
				<div className="top-central-text">{text}</div>
				<div className="right-group">
                    <div className="search-bar-container">a</div>
					<i className="material-icons">search</i>
                    <NotificationPanel></NotificationPanel>
					<i className="material-icons">person</i>
				</div>
			</div>
		</div>
		</>
	)
}

export default TopBarCentralText