import { Story, Meta } from "@storybook/react";
import { Button, ButtonProps } from "./button";

export default {
  component: Button,
  title: "Button"
} as Meta;

// eslint-disable-next-line react/jsx-props-no-spreading
export const Playground: Story<ButtonProps> = (args) => <Button {...args}>Test</Button>;
export const Variants: Story<ButtonProps> = () => <div className="flex justify-between" style={{ maxWidth: 500 }}>
  <Button>filled</Button>
  <Button variant="outlined">outlined</Button>
  <Button variant="gradient">gradient</Button>
  <Button variant="text">text</Button>
</div>;
export const Sizes: Story<ButtonProps> = () => <div className="block gap-4" style={{ maxWidth: 500 }}>
  <Button size="sm">small</Button>
  <Button>md</Button>
  <Button size="lg">large</Button>
</div>;
export const Colors: Story<ButtonProps> = () => <div className="flex justify-between" >
  <Button color="primary">primary</Button>
  <Button>secondary</Button>
  <Button color="info">info</Button>
  <Button color="warning">warning</Button>
  <Button color="danger">danger</Button>
  <Button color="success">success</Button>
  <Button color="dark">dark</Button>
  <Button color="light">light</Button>
</div>;

