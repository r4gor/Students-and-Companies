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
                            <InternshipComponent title="Internship1" status="application"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship2" status="interview"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship2" status="ongoing"></InternshipComponent>
                            <hr />
                            <InternshipComponent title="Internship2" status="terminated"></InternshipComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default StudentInternshipmgmt