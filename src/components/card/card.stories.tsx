import type { StoryObj, Meta } from "storybook-framework-qwik";
import { Card, type CardProps } from "./Card";
import { Button } from "../button/Button";

const meta: Meta<CardProps> = {
    component: Card
};

type Story = StoryObj<CardProps>;

export default meta;

/**
 * CARD STORIES
 */
export const smallCard: Story = {
    args: {
        size: 'sm',
        theme: 'dark'
    },

    render: (props) => (
        <Card {...props}>
            <h2>Esta es una card</h2>
            <p>Esta card define un container o seccion de contenido</p>

            <div>
                <Button size="md" type="button" variant="solid">
                    Action 1
                </Button>
            </div>
        </Card>
    )
} 

export const mediumCard: Story = {
    args: {
        size: 'md',
        theme: 'dark'
    },

    render: (props) => (
        <Card {...props}>
            <h2>Esta es una card</h2>
            <p>Esta card define un container o seccion de contenido</p>
        </Card>
    )
}

export const largeCard: Story = {
    args: {
        size: 'lg',
        theme: 'dark'
    },

    render: (props) => (
        <Card {...props}>
            <h2>Esta es una card</h2>
            <p>Esta card define un container o seccion de contenido</p>
        </Card>
    )
} 
