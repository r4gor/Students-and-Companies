import { Link } from 'react-router-dom'
import './nav_bar.css'

function NavBar () {
    return (
        <>
        <div className="nav-bar">
            <Link to={'/index'} className='nav-bar-link'>Home</Link>
            <Link to={'/index'} className='nav-bar-link'>About</Link>
        </div>
        </>
    )
}

export default NavBar