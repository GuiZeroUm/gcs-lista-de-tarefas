export const POLITICA_DE_SEGURANCA_DE_CONTEUDO = [
  "default-src 'self'",
  // O Next exporta scripts inline de hidratação e o MUI injeta estilos inline.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");
