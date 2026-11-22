const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Postgres rejects non-UUID strings on uuid columns, so check before querying.
export function isUUID(value: string): boolean {
    return UUID_REGEX.test(value)
}
