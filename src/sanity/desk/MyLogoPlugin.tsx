import { definePlugin } from "sanity";

// Then we add another custom logo component as part of a plugin
export const myLogoPlugin = definePlugin({
  name: "my-logo-plugin",
  studio: {
    components: {
      logo: (props) => (
        <div style={{ border: "3px solid hotpink" }}>
          {props.renderDefault({ ...props, title: "my improved title" })}
        </div>
      ),
    },
  },
});
