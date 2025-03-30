const express = require('express');
const router = express.Router();
const { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require('../controllers/campaignController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/create', authMiddleware, createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

module.exports = router;
