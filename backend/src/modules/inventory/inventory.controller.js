const scopedQuery = require('../../db/scopedQuery');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, imageUrl, startingPrice } = req.body;
    const result = await scopedQuery(
      req.user.tenantId,
      `INSERT INTO products (tenant_id, name, description, image_url, starting_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || null, imageUrl || null, startingPrice]
    );
    return res.status(201).json(successResponse(result.rows[0], 'Product created'));
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
    return res.status(200).json(successResponse({
      products: result.rows,
      page: Number(page),
      limit: Number(limit)
    }, 'Products retrieved'));
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
    if (result.rows.length === 0) return res.status(404).json(errorResponse('Product not found'));
    return res.status(200).json(successResponse(result.rows[0], 'Product retrieved'));
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, imageUrl, startingPrice, status } = req.body;
    
    const check = await scopedQuery(req.user.tenantId, `SELECT id FROM products WHERE tenant_id = $1 AND id = $2`, [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json(errorResponse('Product not found'));

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
    return res.status(200).json(successResponse(result.rows[0], 'Product updated'));
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
    if (result.rows.length === 0) return res.status(404).json(errorResponse('Product not found'));
    return res.status(200).json(successResponse(null, 'Product archived'));
  } catch (error) {
    next(error);
  }
};

exports.createSeats = async (req, res, next) => {
  try {
    const { count } = req.body;
    
    const check = await scopedQuery(req.user.tenantId, `SELECT id FROM products WHERE tenant_id = $1 AND id = $2`, [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json(errorResponse('Product not found'));

    const values = [];
    for (let i = 0; i < count; i++) {
        values.push(`($1, $2, 'available')`);
    }

    const result = await scopedQuery(
      req.user.tenantId,
      `INSERT INTO seats (tenant_id, product_id, status) VALUES ${values.join(', ')} RETURNING id`,
      [req.params.id]
    );
    
    return res.status(201).json(successResponse(result.rows, `${count} seats created`));
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
    return res.status(200).json(successResponse(result.rows, 'Seats retrieved'));
  } catch (error) {
    next(error);
  }
};
