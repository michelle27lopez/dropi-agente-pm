export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // En un entorno real, esto llamaría a PostHog u otro proveedor analítico
  // Ej: posthog.capture(eventName, properties)
  
  if (typeof window !== "undefined") {
    console.log(
      `%c[PostHog Track] %c${eventName}`, 
      'color: #f08c3e; font-weight: bold;', 
      'color: white; background: #333; padding: 2px 6px; border-radius: 4px;',
      properties || {}
    );
  }
}
