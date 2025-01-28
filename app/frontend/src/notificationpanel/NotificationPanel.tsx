import "../main.css"
import "./notification_panel.css"

import {useAppState} from "../appstatecontext/AppStateContext"
import { useEffect, useState } from "react";

type NotificationType = {
    id: number,
    sender: string;
    title: string;
    content: string;
    read: boolean;
}

function Notification (index: number, model: NotificationType, onClick: Function) {

    function div_class(): string {
        return "notification-single" + (model.read ? "" : " unread");
    }

    function title(): string {
        let sender = model.sender === undefined ? " " : model.sender;
        return `[${sender}] ${model.title}`
    }

    function content(): JSX.Element {
        let regex = new RegExp(/\[(.+)\]\((.+)\)|\n/, "g")
        let lastIndex = 0;
        let slices: Array<JSX.Element | string> = [];
        let match: RegExpExecArray | null;
        while((match = regex.exec(model.content)) !== null) {
            if (lastIndex < match.index) {
                slices.push(model.content.slice(lastIndex, match.index));
            }
            if (match[0] === "\n") {
                slices.push(<br/>);
            } else {
                slices.push(<a className="link" href={match[2]}>{match[1]}</a>);
            }
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < model.content.length) {
            slices.push(model.content.slice(lastIndex));
        }
        
        return (
            <div id="content">
                {...slices}
            </div>
        );
    }
    
    return (
        <div key={index} className={div_class()} onClick={() => onClick(index)}>
            { !model.read && <i className="material-icons">priority_high</i>}
            <div id="title">{title()}</div>
            {content()}
        </div>
    )
}

function NotificationPanel ()  {
    const email = useAppState().userEmail;
    const [notifications, setNotifications] = useState([] as Array<NotificationType>);
	const [visible, setVisible] = useState(false);
	const [unreadNotifications, setUnreadNotifications] = useState(false);
	
	function toggle_notifications() {
		if (!visible) {
		    fetch_notifications();
		}
		setVisible(!visible);
	}

    async function fetch_notifications(): Promise<void> {
        console.log('fetching notifications')
        await fetch(`http://localhost:4000/api/notifications/fetch/${email}`)
        .then(res => {
            if (!res.ok) {
                return;
            }
            res.json().then((data) => {
                let nots = JSON.parse(data) as Array<NotificationType>;
                setUnreadNotifications(!nots.every(n => n.read));
                if (nots.length > notifications.length) {
                    setNotifications(nots);
                }
            });
        })
        .catch(err => {
            console.error(err);
            return;
        });
    }

    async function handle_notification_click(i: number): Promise<void> {
        if (notifications[i].read) { return; }
        
		const options = {
			method: 'POST',
			headers: {
    			'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({id: notifications[i].id}) // Convert JSON data to a string and set it as the request body
		};

        await fetch(`http://localhost:4000/api/notifications/mark_as_read`, options)
        .then(res => {
            if (!res.ok) {
                console.dir(res);
                return;
            }
            const nots = notifications.slice();
            nots[i].read = true;
            setNotifications(nots);
            setUnreadNotifications(!notifications.every(n => n.read));
        })
        .catch(err => console.error(err));
    }

    useEffect(() => {fetch_notifications()}, []);

    return ( 
        <>
			<i className="material-icons-outlined" onClick={() => toggle_notifications()}>
    			{unreadNotifications ? "notification_important" : "notifications_none"}
			</i>
			{
                visible &&
                <div className="notification-wrapper" onMouseLeave={() => toggle_notifications()}>
                    <div className="notification-panel">
                        <div className="notification-header">
                            Notifications
                            <hr/>
                        </div>
                        {notifications.map((n,i) => Notification(i,n, handle_notification_click))}
                    </div>
                </div>
    		}
        </>
    )
}

export default NotificationPanel
