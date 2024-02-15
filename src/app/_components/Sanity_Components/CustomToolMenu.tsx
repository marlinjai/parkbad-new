import { ToolMenuProps, ToolLink } from "sanity";
import { Button, Flex } from "@sanity/ui";

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
            as={ToolLink}
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
