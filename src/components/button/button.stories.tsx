import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Button, type ButtonProps } from "./Button";
import { HiArrowRightSolid } from '@qwikest/icons/heroicons'
import { $ } from "@builder.io/qwik";

const meta: Meta<ButtonProps> = {
  component: Button,
};

type Story = StoryObj<ButtonProps>;

export default meta;

export const Solid: Story = {
  args: {
    size: "md",
    Icon: $(HiArrowRightSolid),
    type: 'button',
    variant: 'solid'
  },
  render: (props) => <Button {...props}>Button</Button>,
};

export const Subtle: Story = {
  args: {
    size: "md",
    Icon: $(HiArrowRightSolid),
    type: 'button',
    variant: 'subtle'
  },
  render: (props) => <Button {...props}>Button</Button>,
};

export const Outline: Story = {
  args: {
    size: "md",
    Icon: $(HiArrowRightSolid),
    type: 'button',
    variant: 'outline'
  },
  render: (props) => <Button {...props}>Button</Button>,
}
