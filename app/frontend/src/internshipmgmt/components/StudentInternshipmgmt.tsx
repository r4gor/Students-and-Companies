import { TopBarCentralText } from "../../components/top_bar/top_bar";
import InternshipComponent from "./InternshipComponent";

function StudentInternshipmgmt() {

    return (
        <>
        <div className="internship-mgmt student-internship-mgmt">
            <div className="main-flex-container">
                <TopBarCentralText text='Your internships'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            <InternshipComponent title="Internship1" status="applied"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="SW eng" status="accepted"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship lunghissssssima" status="accepted"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship lunghissssssima ancora di più" status="rejected"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship2" status="finished"></InternshipComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default StudentInternshipmgmt