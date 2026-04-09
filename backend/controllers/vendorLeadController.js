const Vendor = require('../models/Vendor');
const Lead = require('../models/Lead');
const LeadTracker = require('../models/LeadTracker');

exports.unlockLead = async (req, res) => {
    try {
        const { vendorId, leadId } = req.body;
        const vendor = await Vendor.findById(vendorId);
        const lead = await Lead.findById(leadId);
        if (vendor.walletBalance < 20) return res.status(400).json({ message: "Low Balance" });
        vendor.walletBalance -= 20; await vendor.save();
        lead.unlockedBy.push(vendorId); await lead.save();
        res.json({ customerPhone: lead.customerPhone });
    } catch (e) { res.status(500).json(e); }
};

exports.sendQuote = async (req, res) => {
    try { const lead = await Lead.findByIdAndUpdate(req.body.leadId, { $push: { quotes: req.body } }); res.json(lead); }
    catch (e) { res.status(500).json(e); }
};

exports.updateLeadStatus = async (req, res) => {
    try { const lt = await LeadTracker.findOneAndUpdate({ leadId: req.body.leadId }, req.body, { upsert: true }); res.json(lt); }
    catch (e) { res.status(500).json(e); }
};

exports.getTrackedLeads = async (req, res) => {
    try { const lt = await LeadTracker.find({ vendorId: req.params.vendorId }).populate('leadId'); res.json(lt); }
    catch (e) { res.status(500).json(e); }
};

exports.getMarketingAudience = async (req, res) => {
    try { res.json([]); } catch (e) { res.status(500).json(e); }
};