import { loadRegistryItem, RegistryItemNotFoundError } from "shadcn/registry";

export async function GET(
  _request: Request,
  context: RouteContext<"/r/[name]">,
) {
  const { name: routeName } = await context.params;
  if (!/^[\w-]+\.json$/.test(routeName)) {
    return Response.json({ error: "Registry item URLs must end in .json." }, { status: 404 });
  }
  const name = routeName.slice(0, -".json".length);

  try {
    const item = await loadRegistryItem(name, {
      cwd: process.cwd(),
      registryFile: "registry.json",
    });

    return Response.json(item, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return Response.json({ error: `Registry item "${name}" was not found.` }, { status: 404 });
    }

    console.error(`Failed to load Uncut-Ui registry item "${name}".`, error);
    return Response.json({ error: "Failed to load the Uncut-Ui registry item." }, { status: 500 });
  }
}
