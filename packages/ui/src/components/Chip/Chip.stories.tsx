import type { Meta, StoryObj } from "@storybook/react";
import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Basic chip
export const Default: Story = {
  args: {
    label: <span>Default Chip</span>,
  },
};

// Chip with tooltip
export const WithTooltip: Story = {
  args: {
    label: <span>Hover me</span>,
    title: "This is a tooltip",
  },
};

// Disabled chip
export const Disabled: Story = {
  args: {
    label: <span>Disabled</span>,
    disabled: true,
  },
};

// Longer text
export const LongText: Story = {
  args: {
    label: <span>This is a longer chip label</span>,
  },
};

