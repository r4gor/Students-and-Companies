import '../main.css'
import './searchPage.css'
import {TopBar} from "../components/top_bar/top_bar"
import { useLocation, useParams} from 'react-router-dom'
import { InternshipInformation } from './utils/internship_information'
import InternshipPreview from './components/InternshipPreview'
import SideColumn from './components/SideColumn'

//@ts-ignore
function SearchPage () {
	const {state} = useLocation()
	const { query } = useParams<{ query?: string }>();
	let internship_list = state===null || state===undefined || !Object.entries(state).length ? [] as InternshipInformation[] : state.result as InternshipInformation[]
	let search_bar_content = query === undefined ? '' : query
	
	return (
		<>
			<div className="search-page">
				<div className="main-flex-container">
					<TopBar></TopBar>
					<div className="central-container">
						<SideColumn search_bar_content={search_bar_content}></SideColumn>
						<div className="box-background">
							{
								internship_list.map((content:any) => 
									<InternshipPreview key={content.id} info={new InternshipInformation(content)}></InternshipPreview>
								)
							}
						</div>
						<div className="side-column" id="right"></div>
					</div>
				</div>
			</div>
		</>
	)
}



export default SearchPage