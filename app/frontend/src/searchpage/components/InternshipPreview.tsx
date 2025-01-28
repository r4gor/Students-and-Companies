import { InternshipInformation } from "../utils/internship_information"
import {date_diff_to_sentence, date_to_ddMMyyyy_string, month_diff} from "../../utils/frontend_date_utils"

function InternshipPreview ({
    info
}:{
    info:InternshipInformation
}) {
    let post_date = date_diff_to_sentence(info.post_date)

    function on_apply_to_internship() {
        //TODO: add implementation
    }
    return (
        <>
        <div className="inner-box-section top-inner-box-section">
            <div className="top-title-section">
                <div id="name">{info.title}</div>
                <div id="post-date">posted {post_date}</div>
            </div>
            <a href="" target="_blank" id="type"><i className="material-icons">apartment</i>{info.company}</a>
            <div id="tags">{
                info.tags !== null && info.tags.map((content:any) => 
                    <div className="tag" key={content}>{content}</div>
                )}</div>
            <div id="description">
                <div className="description-body">{info.description}</div>
                <ul>
                    <li>Duration: {month_diff(info.start_date, info.end_date)} months (from: {date_to_ddMMyyyy_string(info.start_date)} to: {date_to_ddMMyyyy_string(info.end_date)})</li>
                    <li>Salary: {info.salary}€/mo</li>
                    <li>Mode: {info.mode}</li>
                    <li>Place: {info.location}</li>
                </ul>
            </div>
            <div className="apply-container">
                <div className="button-container">
                    <button type="button" className="std-button" id="apply" onClick={on_apply_to_internship}>Apply</button>
                </div>
                <div className="application-expire">application closes: {date_to_ddMMyyyy_string(info.application_end_date)}
                </div>
                <div className="applied-people">{info.applied_students} people applied</div>
            </div>
        </div>
        </>
    )
}

export default InternshipPreview