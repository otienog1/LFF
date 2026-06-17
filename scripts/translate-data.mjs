// scripts/translate-data.mjs
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const locale = process.argv[2];
if (!['es', 'pt'].includes(locale)) {
  console.error('Usage: node scripts/translate-data.mjs <es|pt>');
  process.exit(1);
}

const LANG_NAME = locale === 'es' ? 'Spanish (Latin America)' : 'Brazilian Portuguese';
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('Set ANTHROPIC_API_KEY before running this script');
  process.exit(1);
}

const dataPath = join(__dirname, '..', 'data', 'data.json');
const inputData = readFileSync(dataPath, 'utf-8');

console.log(`Translating data.json to ${LANG_NAME}...`);

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 32000,
    system: `You are a professional translator for a wildlife conservation NGO website.

Translate ALL human-readable text values in the JSON to ${LANG_NAME}.

PRESERVE EXACTLY — do not translate these JSON fields or their values:
- All JSON property names (keys)
- Fields named: id, slug, type, databaseId, url, sourceUrl, srcSet, sizes, link, href, date, tags
- The "slug" field inside typesOfProjects array objects
- The "id" and "databaseId" fields inside typesOfProjects array objects
- Proper nouns that are brand/place names: "Luigi Footprints Foundation", "LFF", "Maniago Safaris", "Amboseli", "Olchani Project", "Kenya", "Nairobi", "PayPal", "Luigi Francescon"
- Email addresses and URLs
- Array values in the "tags" field
- null values

Return ONLY the translated JSON. No markdown fences, no explanation, no extra text.`,
    messages: [{ role: 'user', content: inputData }],
  }),
});

const result = await response.json();
if (result.error) {
  console.error('API error:', JSON.stringify(result.error, null, 2));
  process.exit(1);
}

const translated = result.content[0].text.trim();

try {
  JSON.parse(translated);
} catch {
  console.error('Response is not valid JSON. First 500 chars:');
  console.error(translated.slice(0, 500));
  process.exit(1);
}

const outputPath = join(__dirname, '..', 'data', `data.${locale}.json`);
writeFileSync(outputPath, translated, 'utf-8');
console.log(`Written: ${outputPath}`);
