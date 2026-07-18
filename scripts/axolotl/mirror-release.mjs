import fs from 'node:fs'
import path from 'node:path'

const [manifestPath, outputPath, baseUrl] = process.argv.slice(2)

if (!manifestPath || !outputPath || !baseUrl) {
	throw new Error('Usage: node mirror-release.mjs <manifest> <output> <base-url>')
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const mirror = structuredClone(manifest)

for (const [platform, update] of Object.entries(mirror.platforms ?? {})) {
	if (!update || typeof update.url !== 'string') {
		throw new Error(`Missing update URL for ${platform}`)
	}

	const filename = path.posix.basename(new URL(update.url).pathname)
	if (!filename) {
		throw new Error(`Could not determine update filename for ${platform}`)
	}

	update.url = `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(filename)}`
}

fs.writeFileSync(outputPath, `${JSON.stringify(mirror, null, 2)}\n`)
