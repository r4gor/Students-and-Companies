import { InternshipInformation } from "../utils/internship_information"
import {date_diff_to_sentence, date_to_ddMMyyyy_string, month_diff} from "../../utils/frontend_date_utils"
import { useAppState } from "../../appstatecontext/AppStateContext";
import { format_search_parameters } from "../handle_search";
import { useState } from "react";

function InternshipPreview ({
    info
}:{
    info:InternshipInformation
}) {
    const user_email = useAppState().userEmail;
    let post_date = date_diff_to_sentence(info.post_date)
    const [applied, setApplied] = useState(false)

    function on_apply_to_internship() {
        if(applied)
            return
        let url = new URL('http://localhost:4000/api/internship_management/apply_to_internship')
        url.search = format_search_parameters({
            internship_id: info.id,
            user_email: user_email
        })
        fetch(url, {
            method: "POST"
        }).then(result => {
            if(result.status === 200)
                setApplied(true)
        });
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
                    <li>Salary: {info.salary}€</li>
                    <li>Mode: {info.mode}</li>
                    <li>Place: {info.location}</li>
                </ul>
            </div>
            <div className="apply-container">
                <div className="button-container">
                    <button type="button" className={"std-button" + (applied ? ' applied':'')} id="apply" onClick={on_apply_to_internship}>{applied ? 'Applied':'Apply'}</button>
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

function setState(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
