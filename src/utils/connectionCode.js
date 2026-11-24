/**
 * Shopperzz connection code: sz1.<base64url(JSON { v, shop, key, at })>
 */

function padBase64(str) {
  const pad = str.length % 4
  return pad ? str + '='.repeat(4 - pad) : str
}

export function encodeConnectionCode({ shop, key }) {
  const payload = {
    v: 1,
    shop: String(shop || '').replace(/\/$/, ''),
    key: String(key || '').trim(),
    at: Math.floor(Date.now() / 1000),
  }
  const json = JSON.stringify(payload)
  const b64 = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `sz1.${b64}`
}

export function parseConnectionCode(raw) {
  const text = String(raw || '').trim().replace(/^["']|["']$/g, '')
  if (!text) {
    throw new Error('Paste the Connect key from Shop Admin → Settings → Intelligence Analytics.')
  }

  // Common mistake: tracker secret / public keys
  if (/^sk_/i.test(text)) {
    throw new Error(
      'Yeh Secret key (sk_…) hai — tracker ke liye. Analytics connect ke liye neeche wala Connect key copy karein jo sz1. se shuru hota hai.',
    )
  }
  if (/^pk_/i.test(text)) {
    throw new Error(
      'Yeh Public key (pk_…) hai — storefront tracker ke liye. Dashboard connect ke liye Connect key (sz1.… ) use karein.',
    )
  }

  if (!text.startsWith('sz1.')) {
    throw new Error(
      'Galat key. Connect key sz1. se shuru hoti hai. Shop Admin → Intelligence Analytics → "Copy key" dabayein (Secret/Public key nahi).',
    )
  }

  try {
    const b64 = padBase64(text.slice(4).replace(/-/g, '+').replace(/_/g, '/'))
    const json = atob(b64)
    const data = JSON.parse(json)
    const shop = String(data.shop || data.api_url || '').replace(/\/$/, '')
    const key = String(data.key || data.license_key || '').trim()

    if (!shop || !/^https?:\/\//i.test(shop)) {
      throw new Error('Connection code is missing a valid shop URL.')
    }
    if (!key) {
      throw new Error('Connection code is missing the license key. Shop .env mein VITE_API_KEY set karein.')
    }
    if (/^sk_/i.test(key) || /^pk_/i.test(key)) {
      throw new Error('Connect key invalid — shop license (VITE_API_KEY) missing on server.')
    }

    return { shop, key, version: data.v || 1, at: data.at || null }
  } catch (err) {
    if (
      err.message &&
      (err.message.includes('sz1') ||
        err.message.includes('sk_') ||
        err.message.includes('pk_') ||
        err.message.includes('missing') ||
        err.message.includes('Galat') ||
        err.message.includes('Yeh') ||
        err.message.includes('Connect key') ||
        err.message.includes('license'))
    ) {
      throw err
    }
    throw new Error('Connect key read nahi hui. Shop admin se dubara Copy key karein.')
  }
}
