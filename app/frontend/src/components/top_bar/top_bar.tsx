import "../../main.css"
import SearchBar from "../search_bar/search_bar";
import NotificationPanel from "../../notificationpanel/NotificationPanel";
import NavBar from "../nav_bar/NavBar";
import UserDropdown from "../user_dropdown/UserDropdown";

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
						<UserDropdown></UserDropdown>
					</div>
				</div>
				<NavBar></NavBar>
			</div>
        </>
    )
}