import '../internshipMgmt.css'

function InternshipComponent({title, status}: {title:string,status:string}) {
    const internship_status_map = { 'application':'waiting for application phase end',
                                    'interview':'selected for interview', 
                                    'ongoing': 'in progress', 
                                    'terminated': 'terminated'}
    return (
        <>
        <div className={"internship-component" + (status === 'terminated' ? ' terminated':'')}>
            <div className="left-group">
                <div id="name">{title}</div>
                <div id="status"><span className={status}></span> {internship_status_map[status as keyof typeof internship_status_map]}</div>
            </div>
            {status === 'ongoing' && (<button type="button" className="std-button small" id="profile">Open complaint</button>)}
        </div>
        </>
    )
}

export default InternshipComponent