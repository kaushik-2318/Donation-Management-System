const express = require('express');
const router = express.Router();
const { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign, manageCampaigns } = require('../controllers/campaignController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, createCampaign);
router.get('/manage', authMiddleware, manageCampaigns);
router.get('/', getAllCampaigns);
router.put('/:id', updateCampaign);
router.get('/:id', getCampaignById);
router.delete('/:id', deleteCampaign);

module.exports = router;
