import '../../main.css'
import '../searchPage.css'
import {ChangeEvent, useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { fetch_all_tags, get_internship_list_http_query } from '../handle_search'
import { useAppState } from '../../appstatecontext/AppStateContext'

function SideColumn ({search_bar_content}:{search_bar_content:string}) {
	const user_email = useAppState().userEmail as string;
	const [orderby, setOrderBy] = useState('posted')
	const [direction, setDirection] = useState('1')
	const [salary, setSalary] = useState('0')
	const [duration, setDuration] = useState('1')
	const [mode, setMode] = useState('all')
	const [fetched_tags, setFetchedTags] = useState([])
	const [displayed_tags, setDisplayedTags] = useState([])
	const [selected_tags, setSelectedTags] = useState([] as string[])
	const navigate = useNavigate()

	useEffect(() => {
		const fetch_tags = async () => {
			const response = await fetch_all_tags()
			const data = await response.json()
			let data_map = data.rows.map((obj:any) => obj.description)
			setFetchedTags(data_map)
			setDisplayedTags(data_map)
		}
		fetch_tags()
	}, []);

	function on_apply_filter() {
		get_internship_list_http_query(user_email, search_bar_content,orderby,direction,salary,duration,mode,selected_tags).then((result) => {
			navigate('/search_page/'+search_bar_content, {state: {result:result}})
		});
	}

	function update_displayed_tags(e:ChangeEvent<HTMLInputElement>) {
		let tag_search_value = e.target.value
		if(tag_search_value === '')
			setDisplayedTags(fetched_tags)
		else
			setDisplayedTags(fetched_tags.filter((str:string) => str.toLowerCase().indexOf(tag_search_value.toLowerCase()) > -1 ))
	}

	function on_tag_click(e:any) {
		let tag_descr = e.target.innerHTML as string

		e.target.classList.toggle('selected')
		if(selected_tags.includes(tag_descr)) // toggle tag from selected_tags
			setSelectedTags(selected_tags.filter(el => el !== tag_descr))
		else
			setSelectedTags([...selected_tags, tag_descr])
	}

	return (
		<>
		<div className="side-column" id="left">
			<label id="orderby">Order by:</label>
			<select name="orderby" id="orderby" onChange={(e:ChangeEvent<HTMLSelectElement>) => setOrderBy(e.target.value)}>
				<option value="posted">publishing date</option>
				<option value="salary">salary</option>
				<option value="duration">duration</option>
			</select>
			<select name="direction" id="direction" onChange={(e:ChangeEvent<HTMLSelectElement>) => setDirection(e.target.value)}>
				<option value="1">ascending</option>
				<option value="0">descending</option>
			</select>

			<label id="salary">Minimum salary:</label>
			<select name="salary" id="salary" onChange={(e:ChangeEvent<HTMLSelectElement>) => setSalary(e.target.value)}>
				<option value="0">no salary</option>
				<option value="100">100€</option>
				<option value="200">200€</option>
				<option value="300">300€</option>
				<option value="400">400€</option>
				<option value="500">500€</option>
				<option value="600">600€</option>
				<option value="700">700€</option>
			</select>
			<label id="duration">Duration:</label>
			<select name="duration" id="duration" onChange={(e:ChangeEvent<HTMLSelectElement>) => setDuration(e.target.value)}>
				<option value="1">1 month</option>
				<option value="2">2 months</option>
				<option value="3">3 months</option>
				<option value="4">4 months</option>
				<option value="5">5 months</option>
				<option value="6">6 months</option>
				<option value="7"> &gt; 6 months</option>
			</select>
			<label id="mode">Mode:</label>
			<select name="mode" id="mode" onChange={(e:ChangeEvent<HTMLSelectElement>) => setMode(e.target.value)}>
				<option value="all">All</option>
				<option value="presence">In presence</option>
				<option value="remote">Full remote</option>
				<option value="mixed">Mixed</option>
			</select>
			<label id="tags">Tags:</label>
			<input 	type="search" 
					name="tag-search" 
					id="tag-search" 
					placeholder="Search tags..." 
					onChange={(e:ChangeEvent<HTMLInputElement>) => update_displayed_tags(e)
			}/>
			<div className="tags-container">
				{
					displayed_tags.map((content:any) =>
						<div className="tag" key={content} onClick={(e:any) => on_tag_click(e)}>{content}</div>	
					)
				}
			</div>
			<button type="button" className="std-button" onClick={on_apply_filter}>Apply filters</button>
		</div>
		</>
	)	
}

export default SideColumn