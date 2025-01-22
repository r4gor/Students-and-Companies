import { useAppState } from "../appstatecontext/AppStateContext";
import StudentInternshipmgmt from "./components/StudentInternshipmgmt";

function InternshipManagement ()  {
    const userType = useAppState().userType;
    
    return (
        <>
        {userType === 'student' && (<StudentInternshipmgmt></StudentInternshipmgmt>)}
        </>
    )
}

export default InternshipManagement