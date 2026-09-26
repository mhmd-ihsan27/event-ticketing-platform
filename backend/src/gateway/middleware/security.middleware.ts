import helmet from 'helmet';
import { RequestHandler } from 'express';

/**
 * Security headers middleware using Helmet.
 *
 * Protections applied automatically:
 * - X-DNS-Prefetch-Control        — Disable DNS prefetching
 * - X-Frame-Options               — Prevent Clickjacking (DENY)
 * - X-Content-Type-Options        — Prevent MIME sniffing (nosniff)
 * - Strict-Transport-Security     — Enforce HTTPS (HSTS)
 * - X-XSS-Protection             — Enable legacy XSS filter
 * - Referrer-Policy               — Control referrer info leakage
 * - Content-Security-Policy       — Restrict resource loading
 */
export const securityMiddleware: RequestHandler = helmet();
