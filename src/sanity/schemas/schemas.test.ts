// Compiles the Studio schema with Sanity's own schema builder, the same step the
// Studio runs on startup, so a schema that a Sanity upgrade breaks (renamed
// field options, removed built-in types, plugin helpers that changed shape)
// fails here instead of on the /admin route.
import { createSchema } from 'sanity';
import { describe, expect, it } from 'vitest';

import schemas from './index';

describe('Sanity Studio schema', () => {
  it('compiles every document type without schema errors', () => {
    const schema = createSchema({ name: 'default', types: schemas });
    const errors = (schema._validation ?? []).flatMap((group) =>
      group.problems
        .filter((problem) => problem.severity === 'error')
        .map((problem) => `${group.path.map((p) => p.name).join('.')}: ${problem.message}`)
    );

    expect(errors).toEqual([]);
    for (const type of schemas) {
      expect(schema.get(type.name), type.name).toBeDefined();
    }
  });
});
