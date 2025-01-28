import { useState } from "react"
import { useAppState } from "../../appstatecontext/AppStateContext"
import './user_dropdown.css'

function UserDropdown() {
    const user_email = useAppState().userEmail
    const user_type = useAppState().userType
    const [is_visible, setVisible] = useState(false)
    const user_type_map = {
        'u':'University',
        'c':'Company',
        's':'Student'
    }

    function toggle_panel() {
        setVisible(!is_visible)
    }

    function on_logout() {
        localStorage.clear()
        window.location.href = '/';
    }

    return (
        <>
        <div className="user-dropdown" onMouseLeave={() => setVisible(false)}>
            <i className="material-icons top-bar-icon" onClick={() => toggle_panel()}>person</i>
            {
                is_visible &&
                <div className="user-dropdown-wrapper">
                    <div className="user-dropdown-panel" >
                        <div className="user-dropdown-header">
                            <div id="email"><a href={'/profile/' + user_email}>{user_email}</a></div>
                            <div id="type">{user_type_map[user_type as keyof typeof user_type_map]} account</div>
                            <hr/>
                        </div>
                        <div className="user-dropdown-content">
                            <div className="menu-button" id="logout" onClick={on_logout}>Logout</div>
                        </div>
                    </div>
                </div>
            }
        </div>
        
        </>
    )
}

export default UserDropdown