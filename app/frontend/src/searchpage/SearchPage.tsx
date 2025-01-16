import '../main.css'
import './searchPage.css'
import {TopBar} from "../components/top_bar/top_bar"

function SearchPage () {
	return (
		<>
			<div className="search-page">
				<div className="main-flex-container">
					<TopBar></TopBar>
					<div className="central-container">
						<SideColumn></SideColumn>
						<div className="box-background"></div>
						<div className="side-column" id="right"></div>
					</div>
				</div>
			</div>
		</>
	)
}

function SideColumn () {
	return (
		<>
		<div className="side-column" id="left">
			<label id="orderby">Order by:</label>
			<select name="orderby" id="orderby">
				<option value="relevance">relevance</option>
				<option value="salary">salary</option>
				<option value="duration">duration</option>
			</select>
			<select name="direction" id="direction">
				<option value="0">ascending</option>
				<option value="1">descending</option>
			</select>

			<label id="salary">Minimum salary:</label>
			<select name="salary" id="salary">
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
			<select name="duration" id="duration">
				<option value="1">1 month</option>
				<option value="2">2 months</option>
				<option value="3">3 months</option>
				<option value="4">4 months</option>
				<option value="5">5 months</option>
				<option value="6">6 months</option>
				<option value="7"> 6 months</option>
			</select>
			<label id="mode">Mode:</label>
			<select name="mode" id="mode">
				<option value="1">In presence</option>
				<option value="2">Full remote</option>
				<option value="3">Mixed</option>
			</select>
			<label id="mode">Tags:</label>
			<input type="search" name="tag-search" id="tag-search" placeholder="Search tags..."/>
			<div className="tags-container">
			</div>
			<button type="button" className="std-button">Apply filters</button>
		</div>
		</>
	)	
}

export default SearchPage