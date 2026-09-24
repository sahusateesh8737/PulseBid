const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const validate = require('../../middleware/validate');
const schema = require('./inventory.schema');
const { authMiddleware, requireRole } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/products', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.createProductSchema), inventoryController.createProduct);
router.get('/products', inventoryController.listProducts);
router.get('/products/:id', inventoryController.getProduct);
router.put('/products/:id', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.updateProductSchema), inventoryController.updateProduct);
router.delete('/products/:id', requireRole(['tenant_admin', 'admin']), inventoryController.deleteProduct);

router.post('/products/:id/seats', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.createSeatsSchema), inventoryController.createSeats);
router.get('/products/:id/seats', inventoryController.listSeats);

module.exports = router;
