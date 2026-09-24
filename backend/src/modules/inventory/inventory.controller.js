const scopedQuery = require('../../db/scopedQuery');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, imageUrl, startingPrice } = req.body;
    const result = await scopedQuery(
      req.user.tenantId,
      `INSERT INTO products (tenant_id, name, description, image_url, starting_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, imageUrl, startingPrice]
    );
    return successResponse(res, 201, 'Product created', result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.listProducts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM products WHERE tenant_id = $1`;
    const params = [];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await scopedQuery(req.user.tenantId, query, params);
    return successResponse(res, 200, 'Products retrieved', {
      products: result.rows,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const result = await scopedQuery(
      req.user.tenantId,
      `SELECT * FROM products WHERE tenant_id = $1 AND id = $2`,
      [req.params.id]
    );
    if (result.rows.length === 0) return errorResponse(res, 404, 'Product not found');
    return successResponse(res, 200, 'Product retrieved', result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, imageUrl, startingPrice, status } = req.body;
    
    const check = await scopedQuery(req.user.tenantId, `SELECT id FROM products WHERE tenant_id = $1 AND id = $2`, [req.params.id]);
    if (check.rows.length === 0) return errorResponse(res, 404, 'Product not found');

    const result = await scopedQuery(
      req.user.tenantId,
      `UPDATE products 
       SET name = COALESCE($2, name), 
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           starting_price = COALESCE($5, starting_price),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE tenant_id = $1 AND id = $7 RETURNING *`,
      [name, description, imageUrl, startingPrice, status, req.params.id]
    );
    return successResponse(res, 200, 'Product updated', result.rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const result = await scopedQuery(
      req.user.tenantId,
      `UPDATE products SET status = 'archived', updated_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING id`,
      [req.params.id]
    );
    if (result.rows.length === 0) return errorResponse(res, 404, 'Product not found');
    return successResponse(res, 200, 'Product archived');
  } catch (error) {
    next(error);
  }
};

exports.createSeats = async (req, res, next) => {
  try {
    const { count } = req.body;
    
    const check = await scopedQuery(req.user.tenantId, `SELECT id FROM products WHERE tenant_id = $1 AND id = $2`, [req.params.id]);
    if (check.rows.length === 0) return errorResponse(res, 404, 'Product not found');

    const values = [];
    for (let i = 0; i < count; i++) {
        values.push(`($1, $2, 'available')`);
    }

    const result = await scopedQuery(
      req.user.tenantId,
      `INSERT INTO seats (tenant_id, product_id, status) VALUES ${values.join(', ')} RETURNING id`,
      [req.params.id]
    );
    
    return successResponse(res, 201, `${count} seats created`, result.rows);
  } catch (error) {
    next(error);
  }
};

exports.listSeats = async (req, res, next) => {
  try {
    const result = await scopedQuery(
      req.user.tenantId,
      `SELECT * FROM seats WHERE tenant_id = $1 AND product_id = $2 ORDER BY created_at DESC`,
      [req.params.id]
    );
    return successResponse(res, 200, 'Seats retrieved', result.rows);
  } catch (error) {
    next(error);
  }
};
