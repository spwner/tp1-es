const express = require('express');
const {
  getMenu,
  createMenuItem,
  updateMenuPrice,
  deleteMenuItem,
} = require('../controllers/menuController');
const { adminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMenu);
router.post('/', adminAuth, createMenuItem);
router.put('/:id', adminAuth, updateMenuPrice);
router.delete('/:id', adminAuth, deleteMenuItem);

module.exports = router;
