const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const validate = require('../../middleware/validate');
const schema = require('./inventory.schema');
const { authMiddleware, requireRole } = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.createProductSchema), inventoryController.createProduct);
router.get('/', inventoryController.listProducts);
router.get('/:id', inventoryController.getProduct);
router.put('/:id', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.updateProductSchema), inventoryController.updateProduct);
router.delete('/:id', requireRole(['tenant_admin', 'admin']), inventoryController.deleteProduct);

router.post('/:id/seats', requireRole(['tenant_admin', 'admin', 'manager']), validate(schema.createSeatsSchema), inventoryController.createSeats);
router.get('/:id/seats', inventoryController.listSeats);

module.exports = router;
