import { component$, useStylesScoped$ } from "@builder.io/qwik";
import appHeadStyles from './app-head.css?inline'
import { NavLink } from "../NavLink/NavLink";

export const AppHead = component$(() => {
    useStylesScoped$(appHeadStyles)

    return (
        <div class='app-head'>
            <div class='container'>
                <div class='name'>
                    <NavLink href="/">
                        Business name
                    </NavLink>
                </div>
                <div class='image'>
                    <img
                        src="https://yi-files.s3.eu-west-1.amazonaws.com/products/788000/788543/1342681-full.jpg"
                        alt="a business image"
                        width={40}
                        height={40}
                    />
                </div>
            </div>
        </div>
    )
})
