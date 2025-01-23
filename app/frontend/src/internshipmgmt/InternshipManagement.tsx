import { useAppState } from "../appstatecontext/AppStateContext";
import StudentInternshipmgmt from "./components/StudentInternshipmgmt";

function InternshipManagement ()  {
    const userType = useAppState().userType;
    
    return (
        <>
        {userType === 's' && (<StudentInternshipmgmt></StudentInternshipmgmt>)}
        </>
    )
}

export default InternshipManagement