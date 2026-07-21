import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const [tag, outputDirectory] = process.argv.slice(2)

if (!tag || !outputDirectory || !/^v\d+\.\d+\.\d+$/.test(tag)) {
	throw new Error('Usage: node prepare-aur-package.mjs <stable-version-tag> <output-directory>')
}

const templatePath = 'apps/app/arch/aur/PKGBUILD.in'
const template = fs.readFileSync(templatePath, 'utf8')
const sourceUrl = `https://codeload.github.com/Mystic-Stars/Axolotl/tar.gz/${tag}`
let sourceSha256 = process.env.AUR_SOURCE_SHA256

if (!sourceSha256) {
	const response = await fetch(sourceUrl, { redirect: 'follow' })

	if (!response.ok || !response.body) {
		throw new Error(`Downloading ${sourceUrl} failed (${response.status})`)
	}

	const sourceHash = createHash('sha256')
	for await (const chunk of response.body) {
		sourceHash.update(chunk)
	}

	sourceSha256 = sourceHash.digest('hex')
}

if (!/^[a-f0-9]{64}$/.test(sourceSha256)) {
	throw new Error('AUR_SOURCE_SHA256 must be a SHA-256 hash')
}

const packageBuild = template
	.replace('@PKGVER@', tag.slice(1))
	.replace('@SOURCE_SHA256@', sourceSha256)

fs.mkdirSync(outputDirectory, { recursive: true })
fs.writeFileSync(path.join(outputDirectory, 'PKGBUILD'), packageBuild)
for (const fileName of ['axolotl-launcher.desktop', 'red.ghs.axolotl.xml']) {
	fs.copyFileSync(path.join('apps/app/arch', fileName), path.join(outputDirectory, fileName))
}
console.log(`Prepared AUR package for ${tag}`)
