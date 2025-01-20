import "../main.css"
import "./notification_panel.css"

import {useAppState} from "../appstatecontext/AppStateContext"
import { useState } from "react";

type NotificationType = {
    sender: string;
    title: string;
    content: string;
    read: boolean;
}

function Notification (index: number, model: NotificationType) {

    function div_class(): string {
        return "notification-single" + (model.read ? "" : " unread");
    }

    function title(): string {
        let sender = model.sender === undefined ? " " : model.sender;
        return `[${sender}] ${model.title}`
    }
    
    return (
        <div key={index} className={div_class()}>
            <i className="material-icons">priority_high</i>
            <div id="title">{title()}</div>
            <div id="content">{model.content}</div>
        </div>
    )
}

function NotificationPanel (visible: boolean)  {
    const email = useAppState().userEmail;
    const [notifications, setNotifications] = useState([] as Array<NotificationType>);

    async function fetch_notifications(): Promise<void> {
        console.log('fetching notifications')
        await fetch(`http://localhost:4000/api/notifications/fetch/${email}`)
        .then(res => {
            if (!res.ok) {
                return;
            }
            res.json().then((data) => {
                setNotifications(JSON.parse(data) as Array<NotificationType>);
                console.dir(notifications);
            });
        })
        .catch(err => {
            console.error(err);
            return;
        });
    }

    return (
        visible && 
        <>
            <div className="notification-wrapper" onClick={() => fetch_notifications()}>
                <div className="notification-panel">
                    <div className="notification-header">
                        Notifications
                        <hr/>
                    </div>
                    {notifications.map((n,i) => Notification(i,n))}
                </div>
            </div>
        </>
    )
}

export default NotificationPanel
