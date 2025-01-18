import { InternshipInformation } from "../utils/internship_information"
import {date_diff_to_sentence, date_to_ddMMyyyy_string} from "../../utils/frontend_date_utils"

function InternshipPreview ({
    info
}:{
    info:InternshipInformation
}) {
    let post_date = date_diff_to_sentence(info.post_date)
    return (
        <>
        <div className="inner-box-section top-inner-box-section">
            <div className="top-title-section">
                <div id="name">{info.title}</div>
                <div id="post-date">posted {post_date}</div>
            </div>
            <a href="" target="_blank" id="type"><i className="material-icons">apartment</i>{info.company}</a>
            <div id="tags"></div>
            <div id="description">
                <div className="description-body">{info.description}</div>
                <ul>
                    <li>Duration: months</li>
                    <li>Salary: {info.salary}€/mo</li>
                    <li>Mode: {info.mode}</li>
                </ul>
            </div>
            <div className="apply-container">
                <div className="button-container">
                    <button type="button" className="std-button" id="apply">Apply</button>
                </div>
                <div className="application-expire">application closes: {date_to_ddMMyyyy_string(info.application_end_date)}
                </div>
            </div>
        </div>
        </>
    )
}

export default InternshipPreview