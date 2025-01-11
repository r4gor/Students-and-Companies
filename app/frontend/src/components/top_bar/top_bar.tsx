import SearchBar from "../search_bar/search_bar"

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
							<i className="material-icons">notifications_none</i>
							<i className="material-icons">person</i>
						</div>
					</div>
				</div>
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