import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { IconType } from "~/definitions";
import alertStyes from './alert.css?inline'

export interface AlertProps {
    Icon: IconType;
    title: string;
    content?: string;
}

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
