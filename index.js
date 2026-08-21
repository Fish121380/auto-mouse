import { join } from 'node:path'
import z from '@deepseek-ai/schemastery'
import { fileURLToPath } from 'node:url'
import { apply as applyMcpClient } from '@deepseek-ai/dsh-mcp-client'

const DEFAULT_PORT = 49153
const packageRoot = fileURLToPath(new URL('.', import.meta.url))
const pluginRoot = join(packageRoot, 'plugins', 'little-mouse-pointer')

/** Stable DSH bundle plugin name. */
export const name = 'dsh-little-mouse-pointer'

/** The MCP bridge requires the Harness tool registry. */
export const inject = ['tools']

/** Bundle settings for the loopback port used by the desktop process. */
export const Config = z.object({
  port: z.number().step(1).min(1).max(65535).default(DEFAULT_PORT),
})

/**
 * Mount the bundled Windows MCP server through the Harness MCP client.
 *
 * @param ctx - Harness context with the tool registry.
 * @param config - Resolved loopback port configuration.
 */
export async function apply(ctx, config) {
  if (process.platform !== 'win32') {
    throw new Error('dsh-little-mouse-pointer requires Windows x64')
  }
  const endpoint = `http://127.0.0.1:${config.port}/`
  await applyMcpClient(ctx, {
    transport: 'stdio',
    serverName: 'little-mouse-pointer',
    command: join(pluginRoot, 'app', 'MousePointer.Windows.exe'),
    args: ['--mcp-stdio', '--endpoint', endpoint],
    env: { MOUSE_POINTER_HTTP_PORT: String(config.port) },
    cwd: pluginRoot,
    toolCallTimeoutMs: 60_000,
    failOnStartupError: true,
  })
}
