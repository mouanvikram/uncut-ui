import { loadRegistry } from "shadcn/registry";

export async function GET() {
  try {
    const registry = await loadRegistry({
      cwd: process.cwd(),
      registryFile: "registry.json",
    });

    return Response.json(registry, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Failed to load Uncut-Ui registry catalog.", error);
    return Response.json({ error: "Failed to load the Uncut-Ui registry catalog." }, { status: 500 });
  }
}
