import { ChangeEvent, useState } from 'react'
import { Form, useNavigate } from 'react-router'
import { get_internship_list_http_query_no_filters } from '../../searchpage/handle_search'
import '../../main.css'
import './search_bar.css'

function SearchBar() {
	const [search_bar_content, set_search_bar_content] = useState('')
	const navigate = useNavigate();

	function handle_search_input(evt:any, text:string) {
		if(evt.key === 'Enter') {
			get_internship_list_http_query_no_filters(text).then((res) => {
				navigate('/search_page')
			});
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
								onChange={(e:ChangeEvent<HTMLInputElement>) => set_search_bar_content(e.target.value)}
								onKeyDown={(e) => handle_search_input(e, search_bar_content)}
						/>
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