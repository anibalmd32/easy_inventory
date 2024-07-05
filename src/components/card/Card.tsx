/**
 * ===================
 * | IMPORTS         |
 * ===================
 */
import { component$, useStylesScoped$, Slot } from "@builder.io/qwik";
import cardStyles from './card.css?inline';
import type { ComponentSize, ComponentTheme } from "~/definitions";

/**
 * ===================
 * | INTERFACE       |
 * ===================
 */
export interface CardProps {
    size: ComponentSize;
    theme: ComponentTheme;
}

/**
 * ===================
 * | COMPONENT       |
 * ===================
 */
/**
 * @component
 * 
 * @description A container component that displays content in a compact and organized way
 * 
 * @param {ComponentSize} size - Component size: 'sm' | 'md' | 'lg'
 * @param {ComponentTheme} theme - Component theme: 'dark' | 'light';
 * 
 * @example
 * <Card size='lg' theme='dark'>
 *  {...some elements to display into the card}
 * </Card>
 */
export const Card = component$<CardProps>(({ size, theme }) => {
    useStylesScoped$(cardStyles)
    return (
        <article class={`card ${size} ${theme}`}>
            <Slot />
        </article>
    )
})
