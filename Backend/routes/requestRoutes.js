const express = require('express');
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");

const { createRequest, getAllRequests, getRequestById, updateRequest, deleteRequest } = require('../controllers/requestController');

router.post('/create', authMiddleware, createRequest);
router.get('/', getAllRequests);
router.get('/:id', authMiddleware, getRequestById);
router.put('/:id', authMiddleware, updateRequest);
router.delete('/:id', authMiddleware, deleteRequest);

module.exports = router;
