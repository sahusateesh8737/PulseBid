const { query } = require('../config/db');

/**
 * Executes a query with a mandatory tenantId filter.
 * 
 * Ensures the developer supplies tenantId which automatically becomes $1.
 * Subsequent parameters start at $2.
 * 
 * Example usage:
 * scopedQuery('tenant-123', 'SELECT * FROM products WHERE tenant_id = $1 AND id = $2', [productId])
 */
const scopedQuery = async (tenantId, text, params = []) => {
  if (!tenantId) {
    throw new Error('Tenant ID is required for scoped queries.');
  }

  if (typeof text !== 'string' || !text.includes('$1')) {
    throw new Error('Scoped query must reference $1 for the tenant_id.');
  }

  const finalParams = [tenantId, ...params];
  
  return query(text, finalParams);
};

module.exports = scopedQuery;
