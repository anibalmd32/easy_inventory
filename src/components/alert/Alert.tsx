/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import alertStyes from './alert.css?inline'
import type { IconType } from "~/definitions";

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface AlertProps {
    title: string;
    Icon: IconType;
    content?: string;
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */

/**
 * @component
 * 
 * A component that display a brief, important message for the user.
 * 
 * @param {string} title - The title of the alert.
 * @param {IconType} Icon - The icon to be displayed in the alert.
 * @param {string} [content] - Optional content for the alert.
 * 
 * @example
 * <Alert
 *  title='Some message'
 *  content='Lorem ipsun dolor...'
 *  icon={HiBellAlertOutline}
 * />
 * 
 */
export const Alert = component$<AlertProps>(({
    content,
    Icon,
    title
}) => {

    useStylesScoped$(alertStyes)

    return (
        <article class="alert">
            <div class="alert-icon">
                <Icon />
            </div>

            <div class="alert-body">
                <p class="alert-title">
                    {title}
                </p>

                {content && (
                    <p class="alert-content">
                        {content}
                    </p>
                )}
            </div>
        </article>
    )
})
