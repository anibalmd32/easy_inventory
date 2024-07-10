import { type QRL } from "@builder.io/qwik";

export type IconType = (props: SVGProps<SVGSVGElement>) => JSXNode;
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'solid' | 'subtle' | 'outline';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ComponentTheme = 'dark' | 'light';

export interface FormController<T> {
	name: keyof T;
	value: T[keyof T];
	onChange: QRL<(value: T[keyof T]) => void>;
	error: string | null;
}
