/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { PortableText } from "@portabletext/react";

export default function PostBody(content: any) {
  return (
    <div className={`mx-auto max-w-2xl `}>
      <PortableText value={content} />
    </div>
  );
}
