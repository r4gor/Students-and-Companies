import "../../main.css"
import SearchBar from "../search_bar/search_bar";
import NotificationPanel from "../../notificationpanel/NotificationPanel";
import NavBar from "../nav_bar/NavBar";

export function TopBar () {

    return (
        <>
			<div className="top_bar">
				<div className="top-bar">
					<div className="logo">
						S&C
					</div>
					<SearchBar></SearchBar>
					<div className="right-group">
						<NotificationPanel></NotificationPanel>
						<i className="material-icons">person</i>
					</div>
				</div>
				<NavBar></NavBar>
			</div>
        </>
    )
}