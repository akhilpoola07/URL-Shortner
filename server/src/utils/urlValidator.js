const RESERVED_ALIASES = new Set([
    'api',
    'auth',
    'urls',
    'analytics',
    'health',
    'login',
    'register',
    'dashboard',
    'settings',
    'profile',
    'links',
    'create',
    'static',
    'assets',
    'favicon.ico',
    'admin',
    'root',
    'public',
    'index'
]);

/**
 * Validates whether a given string is a valid HTTP or HTTPS URL
 */
const isValidHttpUrl = (stringUrl) => {
    if (!stringUrl || typeof stringUrl !== 'string') return false;
    
    let url;
    try {
        url = new URL(stringUrl);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};

/**
 * Validates alias format and checks against reserved routes
 */
const isValidAlias = (alias) => {
    if (!alias || typeof alias !== 'string') return false;
    
    // Check length: 3 to 30 characters
    if (alias.length < 3 || alias.length > 30) return false;
    
    // Must be alphanumeric, hyphen, or underscore
    const aliasRegex = /^[a-zA-Z0-9_-]+$/;
    if (!aliasRegex.test(alias)) return false;

    // Must not be a reserved alias (case-insensitive)
    if (RESERVED_ALIASES.has(alias.toLowerCase())) return false;

    return true;
};

module.exports = {
    isValidHttpUrl,
    isValidAlias,
    RESERVED_ALIASES
};
