import '../../main.css'
import './search_bar.css'

function SearchBar() {
    return (
        <>
				<div className="search-bar">
					<div className="input-bar-container">
						<div className="input-bar">
							<input type="text" name="Search for an internship" id="search" placeholder="Search for an internship..."/>
							<div className="search-icon-div">
								<i className="material-icons">search</i>	
							</div>
						</div>
					</div>
				</div>
        </>
    )
}

export default SearchBar;