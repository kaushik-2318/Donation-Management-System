const Receiver = require('../models/Receiver');
const Request = require('../models/Request');

const createRequest = async (req, res) => {

    const { title, description, goal, endDate, category, image, proofDocuments } = req.body;
    try {

        if (!title || !description || !goal || !endDate || !category || !proofDocuments) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        const userId = req.user.id;

        const receiver = await Receiver.findById(userId);

        if (!receiver) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (receiver.role !== 'receiver') {
            return res.status(403).json({
                status: 'error',
                message: 'Only receivers can create requests'
            });
        }

        const request = await Request.create({
            user: receiver._id,
            title,
            description,
            amountNeeded: goal,
            endDate,
            category,
            image,
            proofDocuments
        });

        receiver.requests.push(request._id);
        await receiver.save();

        res.status(201).json({
            status: 'success',
            data: request.id
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({ isActive: true });
        
        res.status(200).json({
            status: 'success',
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


const getRequestById = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id).populate('user', 'full_name address');

        if (!request) {
            return next(new Error("Request not found."));
        }

        res.status(200).json({ request });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};


const updateRequest = async (req, res, next) => {
    try {
        const { title, description, amountNeeded, endDate, category, image, proofDocuments, isActive } = req.body;
        const request = await Request.findByIdAndUpdate(req.params.id);

        if (!request) {
            return next(new Error("Request not found."));
        }

        if (request.user.toString() !== req.user.id && req.user.role !== "admin") {
            return next(new Error("Access denied. You can only edit your own request."));
        }

        if (title) request.title = title.trim();
        if (description) request.description = description.trim();
        if (amountNeeded) request.amountNeeded = amountNeeded;
        if (endDate) request.endDate = endDate;
        if (category) request.category = category;
        if (image) request.image = image;
        if (proofDocuments) request.proofDocuments = proofDocuments;
        if (isActive) request.isActive = isActive;


        await request.save();

        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

const deleteRequest = async (req, res, next) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);

        if (!request) {
            return next(new Error("Request not found."));
        }

        res.status(200).json({
            status: 'success',
            message: 'Request deleted successfully.'
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports = { createRequest, getAllRequests, getRequestById, updateRequest, deleteRequest };