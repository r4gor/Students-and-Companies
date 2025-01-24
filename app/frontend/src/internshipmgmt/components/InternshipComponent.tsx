import '../internshipMgmt.css'

function InternshipComponent({title, status, position}: {title:string,status:string, position:number}) {
    const internship_status_map = { 'applied':'waiting for selection',
                                    'accepted':'accepted', 
                                    'rejected': 'rejected', 
                                    'finished': 'terminated'}
    return (
        <>
        <div className={"internship-component" + 
                        (status === 'finished' || status === 'rejected' ? ' terminated':'') + 
                        (position%2 === 1 ? ' odd':'')}>
            <div className="left-group">
                <div id="name">{title}</div>
                <div id="status"><span className={status}></span> {internship_status_map[status as keyof typeof internship_status_map]}</div>
            </div>
            {status === 'accepted' && (<button type="button" className="std-button small" id="profile">Open complaint</button>)}
        </div>
        </>
    )
}

export default InternshipComponent