// node repro.mjs -- edits src/Page.jsx (text edit, rename, text edit) and prints the DOM after each step
import { readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const file = new URL('./src/Page.jsx', import.meta.url)
const original = readFileSync(file, 'utf8')
const server = await createServer({ server: { port: 4174, strictPort: true }, optimizeDeps: { force: true }, logLevel: 'warn' })
await server.listen()
let browser
try {
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
  const page = await browser.newPage()
  const logs = []
  page.on('console', (m) => logs.push(m.text()))
  await page.goto('http://localhost:4174/')
  await page.waitForSelector('#page')
  const steps = [
    ['v2', original.replace('v1', 'v2')],
    ['rename v3', original.replace('v1', 'v3').replaceAll('Page', 'RenamedPage')],
    ['v4', original.replace('v1', 'v4').replaceAll('Page', 'RenamedPage')],
  ]
  for (const [label, src] of steps) {
    logs.length = 0
    writeFileSync(file, src)
    await page.waitForTimeout(1500)
    const invalidated = logs.some((l) => l.includes('invalidate'))
    console.log(label.padEnd(10), (await page.locator('#page').textContent()).padEnd(4), invalidated ? '(invalidate logged)' : '')
  }
} finally {
  writeFileSync(file, original)
  await browser?.close()
  await server.close()
}
