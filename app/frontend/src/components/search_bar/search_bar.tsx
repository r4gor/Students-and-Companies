import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { get_internship_list_http_query_no_filters } from '../../searchpage/handle_search'
import '../../main.css'
import './search_bar.css'

function SearchBar() {
	const [search_bar_content, setSearchBarContent] = useState('')
	const navigate = useNavigate();

	function perform_search(text:string) {
		get_internship_list_http_query_no_filters(text).then((result) => {
			navigate('/search_page', {state: {result:result, search_bar_content:search_bar_content}})
		});
	}

	function handle_search_input(evt:any, text:string) {
		if(evt.key === 'Enter') {
			perform_search(text)
		}
	}

    return (
        <>
			<div className="search-bar">
				<div className="input-bar-container">
					<div className="input-bar">
						<input 	type="text" 
								name="Search for an internship" 
								id="search" 
								placeholder="Search for an internship..."
								value={search_bar_content}
								onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchBarContent(e.target.value)}
								onKeyDown={(e) => handle_search_input(e, search_bar_content)}
						/>
						<div className="search-icon-div">
							<i className="material-icons" onClick={(e:any) => perform_search(search_bar_content)}>search</i>	
						</div>
					</div>
				</div>
			</div>
        </>
    )
}

export default SearchBar;