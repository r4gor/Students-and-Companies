import { ChangeEvent, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { get_internship_list_http_query_no_filters } from '../../searchpage/handle_search'
import '../../main.css'
import './search_bar.css'
import { useAppState } from '../../appstatecontext/AppStateContext'

function SearchBar() {
	const user_email = useAppState().userEmail as string;
	const [search_bar_content, setSearchBarContent] = useState('')
	const navigate = useNavigate();

	function perform_search(text:string) {
		get_internship_list_http_query_no_filters(user_email, text).then((result) => {
			navigate('/search_page/'+text, {state: {result:result}})
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
								onKeyDown={(e) => handle_search_input(e, search_bar_content, navigate)}
						/>
						<div className="search-icon-div">
                            <i className="material-icons" onClick={() => perform_search(search_bar_content,navigate)}>search</i>
                        </div>
					</div>
				</div>
			</div>
        </>
    )
}

export function HiddenSearchBar() {
	const [search_bar_content, setSearchBarContent] = useState('');
    const [search_bar_open, setSearchBarOpen] = useState(false)
	const navigate = useNavigate()
	return (
		<>
		<div className={'input-bar'+ (search_bar_open ? '': ' hidden')}>
			<input type="text"
					name="search"
					id="search"
					placeholder="Search..."
					onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchBarContent(e.target.value)}
					onKeyDown={(e) => handle_search_input(e, search_bar_content, navigate)}/>
			<i className="material-icons" onClick={() => perform_search(search_bar_content, navigate)}>search</i>
		</div>
		{!search_bar_open && <i className="material-icons closed" onClick={() => setSearchBarOpen(true)}>search</i>}
		</>
	)
}

function perform_search(text:string, navigate:NavigateFunction) {
	get_internship_list_http_query_no_filters(text).then((result) => {
		navigate('/search_page', {state: {result:result, search_bar_content:text}})
	});
}

function handle_search_input(evt:any, text:string, navigate:NavigateFunction) {
	if(evt.key === 'Enter') {
		perform_search(text,navigate)
	}
}

export default SearchBar;