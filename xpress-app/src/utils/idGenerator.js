/**
 * Utility to generate and format unified System IDs across the Xpress Platform.
 * Ensures a future-proof, standardized ID system that looks professional.
 */

const PREFIXES = {
  product: 'PRD',
  vendor: 'VND',
  customer: 'CST',
  order: 'ORD',
  payment: 'PAY',
  admin: 'STF', // Staff
  category: 'CAT',
};

/**
 * Generates a brand new random unified ID. Suitable for creating new records
 * if the backend supports custom ID storage.
 * Example: PRD-8F2A9B
 * @param {string} type - The entity type (e.g., 'product', 'vendor')
 * @returns {string} The unified ID
 */
export const generateUnifiedId = (type) => {
  const prefix = PREFIXES[type.toLowerCase()] || 'SYS';
  // Generate random 6 character uppercase alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
};

/**
 * Deterministically formats an existing backend ID (MongoDB/Firebase) into a clean,
 * unified short ID for Display purposes.
 * Example: '65f0v9230804403' -> 'PRD-65F0V9'
 * @param {string} backendId - The raw ID from the database
 * @param {string} type - The entity type
 * @returns {string} The formatted unified display ID
 */
export const formatDisplayId = (backendId, type) => {
  if (!backendId) return 'N/A';
  
  const prefix = PREFIXES[type.toLowerCase()] || 'SYS';
  
  // If the backendId is already a unified ID (e.g., PRD-12345), just return it
  if (backendId.includes('-') && backendId.split('-')[0].length <= 4) {
    return backendId.toUpperCase();
  }

  // Otherwise, deterministically slice the backend ID
  const shortHash = backendId.substring(0, 6).toUpperCase();
  return `${prefix}-${shortHash}`;
};

/**
 * Generates numerical sequence IDs, mostly for backwards compatibility with user requests.
 * @param {string} type - Entity type
 * @returns {string} The unified ID
 */
export const generateNumericalId = (type) => {
    const prefix = PREFIXES[type.toLowerCase()] || 'SYS';
    // Generates a random 6-digit number
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNum}`;
};
