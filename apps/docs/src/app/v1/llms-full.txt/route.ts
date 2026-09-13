import { getLLMText, sourceV1 } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scan = sourceV1.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
