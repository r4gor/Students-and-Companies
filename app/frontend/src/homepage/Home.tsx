import { useNavigate } from "react-router-dom";
import {TopBar} from "../components/top_bar/top_bar"
import './home.css'
import { get_internship_list_http_query_no_filters } from "../searchpage/handle_search";
import { useAppState } from "../appstatecontext/AppStateContext";

function Home ()  {
    const navigate = useNavigate()
    const user_email = useAppState().userEmail //TODO:add to get_internship_list... after merge

    function on_central_click(query:string) {
        get_internship_list_http_query_no_filters(query).then((result) => {
            navigate('/search_page/'+query, {state: {result:result}})
        });
    }

    return (
        <>
        <TopBar></TopBar>
        <div className="home-page">
            <div className="central-container">
                <div className="central-line-div">
                    <div className="central-text">
                        Jumpstart your career today!
                    </div>
                </div>
                <div className="central-buttons-container">
                    <div className="central-buttons-div">
                        <button id="Engineering" onClick={() => on_central_click('engineer')}>Engineering</button>
                        <button id="Design" onClick={() => on_central_click('designer')}>Design</button>
                        <button id="Architecture" onClick={() => on_central_click('architect')}>Architecture</button>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
        </>
    )
}

export default Home