const Lead = require('../models/Lead');
const Vendor = require('../models/Vendor');
const Transaction = require('../models/Transaction');
const LeadTracker = require('../models/LeadTracker');

// ============================================================
// 1. GET AVAILABLE LEADS (IndiaMart Style - Pan India)
// ============================================================
exports.getAvailableLeads = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // 1. Seller ki jankari nikalo
        const seller = await Vendor.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller nahi mila" });
        }

        // 2. 🔥 IndiaMart Style Logic: 
        // Area ko ignore karo, sirf Category match karo pura desh (India) ke liye.
        // Isse product sellers aur service providers dono ko saari leads dikhengi.
        const leads = await Lead.find({
            category: seller.category
        })
            .populate('category', 'name') // Category ka naam dikhane ke liye
            .sort({ createdAt: -1 });

        res.status(200).json(leads);
    } catch (err) {
        console.error("Leads Load Error:", err.message);
        res.status(500).json({ message: "Leads load karne me dikkat hai." });
    }
};

// ============================================================
// 2. LEAD UNLOCK KARNE KA LOGIC (Revenue Model: ₹20)
// ============================================================
exports.unlockLead = async (req, res) => {
    try {
        const { vendorId, leadId } = req.body;

        const vendor = await Vendor.findById(vendorId);
        const lead = await Lead.findById(leadId);

        if (!vendor || !lead) {
            return res.status(404).json({ message: "Data missing!" });
        }

        // 1. Wallet Balance Check (₹20 per lead)
        const leadPrice = 20;
        if (vendor.walletBalance < leadPrice) {
            return res.status(400).json({
                status: "error",
                message: "Insufficient Balance! Kripya wallet recharge karein."
            });
        }

        // 2. Check if already unlocked (Re-unlocking is free)
        if (lead.unlockedBy.includes(vendorId)) {
            return res.status(200).json({
                status: "success",
                message: "Pehle se unlocked hai",
                customerPhone: lead.customerPhone,
                fullAddress: lead.fullAddress
            });
        }

        // 3. Deduction Logic: Paisa kato aur lead list me vendor ko jodo
        vendor.walletBalance -= leadPrice;
        lead.unlockedBy.push(vendorId);

        await vendor.save();
        await lead.save();

        // 4. Transaction Ledger record karo
        await Transaction.create({
            vendorId: vendorId,
            amount: leadPrice,
            type: 'debit',
            description: `Lead Purchased: ${lead.customerName} (${lead.area})`,
            status: 'Success'
        });

        // 5. Success Response with real customer details
        res.status(200).json({
            status: "success",
            message: "Lead Unlocked Successfully!",
            customerPhone: lead.customerPhone,
            fullAddress: lead.fullAddress,
            newBalance: vendor.walletBalance
        });

    } catch (error) {
        console.error("Unlock Error:", error.message);
        res.status(500).json({ message: "Server error during lead unlocking" });
    }
};

// ============================================================
// 3. CRM & QUOTES (Bidding System)
// ============================================================
exports.sendQuote = async (req, res) => {
    try {
        const { leadId, vendorId, price, message } = req.body;
        const lead = await Lead.findByIdAndUpdate(
            leadId,
            { $push: { quotes: { vendorId, price, message, createdAt: Date.now() } } },
            { new: true }
        );
        res.status(200).json({ status: "success", message: "Quote sent!", lead });
    } catch (e) {
        res.status(500).json({ message: "Quote fail" });
    }
};

// ============================================================
// 4. LEAD TRACKING (Status Update)
// ============================================================
exports.updateLeadStatus = async (req, res) => {
    try {
        const { leadId, vendorId, status, notes } = req.body;
        const lt = await LeadTracker.findOneAndUpdate(
            { leadId, vendorId },
            { status, notes, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.status(200).json({ status: "success", tracker: lt });
    } catch (e) {
        res.status(500).json({ message: "Status update fail" });
    }
};

exports.getTrackedLeads = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const tracked = await LeadTracker.find({ vendorId }).populate('leadId');
        res.status(200).json(tracked);
    } catch (e) {
        res.status(500).json({ message: "Tracked leads fetch fail" });
    }
};

// Placeholder for future marketing logic
exports.getMarketingAudience = async (req, res) => {
    res.json([]);
};