import type { ComponentProps, ComponentType, ReactNode } from "react";
import { ToolMenuProps, ToolLink } from "sanity";
import { Button, Flex } from "@sanity/ui";

// Button renders its own label (the `text` prop) as the children of the `as`
// component at runtime, but ToolLink's type marks `children` as required. This
// alias only relaxes that one prop so Button can render ToolLink.
const ButtonToolLink = ToolLink as ComponentType<
  Omit<ComponentProps<typeof ToolLink>, "children"> & { children?: ReactNode }
>;

export default function CustomToolMenu(props: ToolMenuProps) {
  const { activeToolName, context, tools } = props;
  const isSidebar = context === "sidebar";

  // Change flex direction depending on context
  const direction = isSidebar ? "column" : "row";

  return (
    <div className="my-4">
      <Flex gap={2} direction={direction}>
        {tools.map((tool) => (
          <Button
            as={ButtonToolLink}
            key={tool.name}
            name={tool.name}
            padding={3}
            selected={tool.name === activeToolName}
            text={tool.title || tool.name}
            tone="primary"
          />
        ))}
      </Flex>
    </div>
  );
}
