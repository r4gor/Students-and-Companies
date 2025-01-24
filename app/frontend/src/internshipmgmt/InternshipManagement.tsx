import { useAppState } from "../appstatecontext/AppStateContext";
import CompanyInternshipmgmt from "./components/CompanyInternshipmgmt";
import StudentInternshipmgmt from "./components/StudentInternshipmgmt";

function InternshipManagement ()  {
    const userType = useAppState().userType;
    
    return (
        <>
        {userType === 's' && (<StudentInternshipmgmt></StudentInternshipmgmt>)}
        {userType === 'c' && (<CompanyInternshipmgmt></CompanyInternshipmgmt>)}
        </>
    )
}

export default InternshipManagement