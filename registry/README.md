# Uncut-Ui registry

The root `registry.json` composes one manifest per item category. Add registry items as the library grows; the category manifests are intentionally empty at the start.

## Add an item

1. Add source files under the appropriate folder, such as `registry/components/timeline/` or `registry/blocks/workout-dashboard/`.
2. Add an item entry to that category's `registry.json` with a unique `name`, a clear `title` and `description`, a registry `type`, and its files.
3. Declare `dependencies`, `registryDependencies`, CSS variables, and CSS rules in the item when it needs them. Keep component imports and targets portable across React projects.
4. Open `/r/registry.json` to see it in the public catalog and `/r/<name>.json` to inspect the install payload.

File paths in a category manifest are relative to that manifest. For example, a block at `registry/blocks/workout-dashboard/` can be declared in `registry/blocks/registry.json` as:

```json
{
  "name": "workout-dashboard",
  "type": "registry:block",
  "title": "Workout dashboard",
  "description": "A workout tracking dashboard built with Uncut-Ui primitives.",
  "files": [
    {
      "path": "workout-dashboard/workout-dashboard.tsx",
      "type": "registry:component",
      "target": "@components/workout-dashboard.tsx"
    }
  ]
}
```

## Local install setup

In a consuming project's `components.json`, map the namespace to the running Next.js app:

```json
{
  "registries": {
    "@uncut-ui": "http://127.0.0.1:3000/r/{name}.json"
  }
}
```

Then install an item with `bunx --bun shadcn add @uncut-ui/<item-name>`. The registry is empty until an item is added to a category manifest. Replace the local URL with the deployed site origin when publishing.
