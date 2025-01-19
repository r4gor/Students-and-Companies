import '../../main.css'
import '../searchPage.css'
import {ChangeEvent, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { get_internship_list_http_query } from '../handle_search'
//TODO: tags pool
function SideColumn ({search_bar_content}:{search_bar_content:string}) {
	const [orderby, setOrderBy] = useState('posted')
	const [direction, setDirection] = useState('1')
	const [salary, setSalary] = useState('0')
	const [duration, setDuration] = useState('1')
	const [mode, setMode] = useState('presence')
	const [tags, setTags] = useState([])
	const navigate = useNavigate()

	function on_apply_filter() {
		get_internship_list_http_query(search_bar_content,orderby,direction,salary,duration,mode,tags).then((result) => {
			navigate('/search_page', {state: {result:result, search_bar_content:search_bar_content}})
		});
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
				<option value="presence">In presence</option>
				<option value="remote">Full remote</option>
				<option value="mixed">Mixed</option>
			</select>
			<label id="tags">Tags:</label>
			<input type="search" name="tag-search" id="tag-search" placeholder="Search tags..."/>
			<div className="tags-container">
				
			</div>
			<button type="button" className="std-button" onClick={on_apply_filter}>Apply filters</button>
		</div>
		</>
	)	
}

export default SideColumn