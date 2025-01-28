import { Link } from 'react-router-dom'
import './nav_bar.css'
import { useAppState } from '../../appstatecontext/AppStateContext'

function NavBar () {
    const user_type = useAppState().userType
    return (
        <>
        <div className="nav-bar">
            <Link to={'/home'} className='nav-bar-link'>Home</Link>
            {(user_type === 'c' || user_type === 's') && <Link to={'/internship_management'} className='nav-bar-link'>Internships</Link>}
            {(user_type === 'u') && <Link to={'/'} className='nav-bar-link'>Complaints</Link>}
            <Link to={'/about'} className='nav-bar-link'>About</Link>
        </div>
        </>
    )
}

export default NavBar