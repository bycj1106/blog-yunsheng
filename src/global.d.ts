import type { AstroIntegration } from '@swup/astro'

declare global {
  interface Window {
    // type from '@swup/astro' is incorrect
    swup: AstroIntegration
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dataLayer: any[]
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    gtag: (...args: any[]) => void
  }
}
