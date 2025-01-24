import { InternshipInformation } from "../../searchpage/utils/internship_information"
import { date_to_ddMMyyyy_string, month_diff } from "../../utils/frontend_date_utils"

function InternshipComponentExtended({info, position}: {info:InternshipInformation, position:number}) {
    const internship_status_map = { 'application':'application phase',
                                    'interview':'interview phase', 
                                    'ongoing':'ongoing', 
                                    'terminated':'terminated'
                                }
    return (
        <>
        <div className={"internship-component-extended" + 
                            (info.status === 'terminated' ? ' terminated':'') + 
                            (position%2 === 1 ? ' odd':'')}>
            <div className="internship-component">
                <div className="left-group">
                    <div id="name">
                        <div className="title">{info.title}</div>
                        <div id="type">Internship #{info.id}</div>
                    </div>
                    <div id="status"><span className={info.status}></span> {internship_status_map[info.status as keyof typeof internship_status_map]}</div>
                </div>
                <div className="right-group">
                    {render_sub_components(info)}
                </div>
            </div>
            <div className="internship-component-extension">
            <div className="info-element" id="description">{info.description}</div>
                
            </div>
            <div className="internship-component-extension">
                <div className="info-element" id="posted">Posted: {date_to_ddMMyyyy_string(info.post_date)}</div>
                <div className="info-element" id="start">start date: {date_to_ddMMyyyy_string(info.start_date)}</div>
                <div className="info-element" id="end">end date: {date_to_ddMMyyyy_string(info.end_date)}</div>
                <div className="info-element" id="mode">mode: {info.mode}</div>
                <div className="info-element" id="salary">salary: {info.salary}</div>
            </div>
        </div>
        </>
    )
}

function render_sub_components(info:InternshipInformation) {
    switch (info.status) {
        case 'application':
            return (<InternshipComponentExtendedApplication info={info}></InternshipComponentExtendedApplication>)
        case 'interview':
            return (<InternshipComponentExtendedInterview info={info}></InternshipComponentExtendedInterview>)
        case 'ongoing':
            return (<InternshipComponentExtendedOngoing info={info}></InternshipComponentExtendedOngoing>)
        case 'terminated':
            return (<InternshipComponentExtendedTerminated info={info}></InternshipComponentExtendedTerminated>)
    }
}

function InternshipComponentExtendedApplication({info}:{info:InternshipInformation}) {
    return (
        <>
        <div className="info-element" id="application_end">application ends: {date_to_ddMMyyyy_string(info.application_end_date)}</div>
        <div className="info-element" id="candidates">{info.applied_students} {info.applied_students===1 ? 'person':'people'} applied</div>
        </>
    )
}

function InternshipComponentExtendedInterview({info}:{info:InternshipInformation}) {
    return (
        <>
        <div className="info-element" id="candidates">{info.applied_students} candidate{info.applied_students === 1 ? '':'s'}</div>
        <div className="button-container">
            <button type="button" className="std-button">Select candidates</button>
        </div>
        </>
    )
}

function InternshipComponentExtendedOngoing({info}:{info:InternshipInformation}) {
    let is_ended = ((new Date()) >= info.end_date)
    return (
        <>
        <div className="info-element" id="ends in">{is_ended ? 'Ended': 'Ends in '+ month_diff(new Date(),info.end_date)+' months'}</div>
        <div className="button-container">
            <button type="button" className="std-button">Open complaint</button>
            {is_ended && <button type="button" className="std-button">Close internship</button>}
        </div>
        </>
    )
}

function InternshipComponentExtendedTerminated({info}:{info:InternshipInformation}) {
    return (
        <>
        <div className="button-container">
        </div>
        </>
    )
}

export default InternshipComponentExtended