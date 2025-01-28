import { useParams } from "react-router-dom";
import TopBarCentralText from "../components/top_bar/top_bar_central_text";
import { useAppState } from "../appstatecontext/AppStateContext";

function OpenComplaint() {
	const { internship_id } = useParams<{ internship_id?: string }>();
    const user_email = useAppState().userEmail
    const user_type = useAppState().userType
    return (
        <>
        <div className="create-complaint">
            <div className="main-flex-container">
                <TopBarCentralText text='Open complaint'></TopBarCentralText>
                <div className="central-container">
                    <div className="box-background">
                        <div className="inner-box-section">
                            <p>In this page you can open a new complaint. Please be aware that the information you provide inside this form will only be visible 
                                by {user_type === 's' ? 'your university':'the students university'}.
                            </p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default OpenComplaint