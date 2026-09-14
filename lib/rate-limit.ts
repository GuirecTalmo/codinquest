interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  success: boolean;
  retryAfterSeconds: number;
}

// Compteur en mémoire process, à fenêtre fixe. Pattern singleton identique à
// lib/prisma.ts pour survivre au hot-reload de `next dev` sans dupliquer l'état.
const globalForRateLimit = globalThis as unknown as {
  rateLimitBuckets: Map<string, Bucket> | undefined;
};

const buckets = globalForRateLimit.rateLimitBuckets ?? new Map<string, Bucket>();

if (process.env.NODE_ENV !== 'production') {
  globalForRateLimit.rateLimitBuckets = buckets;
}

/**
 * Vérifie et incrémente le compteur de tentatives pour une clé donnée.
 * @param key Identifiant de la ressource limitée (ex: email, IP, userId)
 * @param limit Nombre de tentatives autorisées par fenêtre
 * @param windowMs Durée de la fenêtre en millisecondes
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true, retryAfterSeconds: 0 };
}

/**
 * Extrait l'IP du client à partir des en-têtes de la requête (utile derrière
 * un proxy comme Vercel). Repli sur une clé fixe en développement local où
 * ces en-têtes ne sont pas présents.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
