import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { NotificationData } from "../definitions";
import notificationStyles from '../styles/notification.css?inline'
import {
    HiFolderPlusSolid,
    HiArrowPathSolid,
    HiTrashSolid,
    HiCreditCardSolid
} from '@qwikest/icons/heroicons'

interface NotificationProps {
    notifications: NotificationData[]
}

export const Notification = component$<NotificationProps>(({ notifications }) => {

    useStylesScoped$(notificationStyles)

    const notificationDesign: {[key: string]: { icon: any, color: string }} = {
        'add': {
            icon: <HiFolderPlusSolid />,
            color: '#b6ddff'
        },
        'remove': {
            icon: <HiTrashSolid />,
            color: '#ffc5c5'
        },
        'update': {
            icon: <HiArrowPathSolid />,
            color: '#eed0ff'
        },
        'sell': {
            icon: <HiCreditCardSolid />,
            color: '#b3ffcb'
        }
    }

    return (
        <div class='notifications'>
            <h2>Notificaciones</h2>

            {notifications.length > 0 ? (
                <ul class='container'>
                    {notifications.map(notification => (
                        <li
                            key={notification.id}
                            class='item'
                            style={{
                                color: `${notificationDesign[notification.typeAction].color}`
                            }}
                        >
                            <div class='icon'>
                                <span>
                                    {notificationDesign[notification.typeAction].icon}
                                </span>
                            </div>
                            <div class='description'>
                                <span>
                                    {notification.text}
                                </span>
                                <span>
                                    {notification.date}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay notificaciones</p>
            )}
        </div>
    )
})
