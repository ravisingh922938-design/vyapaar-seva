const Category = require('../models/Category');

exports.seedCategories = async (req, res) => {
    try {
        const categories = [
            // --- HEALTHCARE (20) ---
            { name: "Hospitals" }, { name: "Clinics" }, { name: "Dentists" }, { name: "Pathology Labs" }, { name: "Physiotherapists" }, { name: "Ayurvedic Doctors" }, { name: "Homeopathic Doctors" }, { name: "Pharmacies/Chemists" }, { name: "Opticians" }, { name: "Veterinary Doctors" }, { name: "Psychiatrists" }, { name: "Dermatologists" }, { name: "Gynecologists" }, { name: "Pediatricians" }, { name: "Cardiologists" }, { name: "Diagnostic Centers" }, { name: "Ambulance Services" }, { name: "Blood Banks" }, { name: "Nursing Homes" }, { name: "Yoga Therapy Centers" },

            // --- EDUCATION & COACHING (15) ---
            { name: "Schools (CBSE/ICSE)" }, { name: "Play Schools" }, { name: "Colleges" }, { name: "Engineering Colleges" }, { name: "Medical Colleges" }, { name: "IAS/UPSC Coaching" }, { name: "IIT/JEE Coaching" }, { name: "Bank/SSC Coaching" }, { name: "Computer Training Institutes" }, { name: "Music Classes" }, { name: "Dance Classes" }, { name: "Driving Schools" }, { name: "Home Tutors" }, { name: "Spoken English Classes" }, { name: "Abacus Classes" },

            // --- HOME SERVICES (15) ---
            { name: "Electricians" }, { name: "Plumbers" }, { name: "Carpenters" }, { name: "AC Repair & Service" }, { name: "Refrigerator Repair" }, { name: "Washing Machine Repair" }, { name: "Pest Control Services" }, { name: "Home Cleaning" }, { name: "Water Tank Cleaning" }, { name: "Painting Contractors" }, { name: "Packers & Movers" }, { name: "RO Water Purifier Service" }, { name: "Interior Designers" }, { name: "CCTV Installation" }, { name: "Solar Panel Dealers" },

            // --- AUTOMOBILE (10) ---
            { name: "Car Dealers" }, { name: "Used Car Dealers" }, { name: "Bike Dealers" }, { name: "Car Repair & Services" }, { name: "Tyre Dealers" }, { name: "Car Accessories" }, { name: "Battery Dealers" }, { name: "Auto Spare Parts" }, { name: "Car Wash Centers" }, { name: "Bike Repair Centers" },

            // --- REAL ESTATE (10) ---
            { name: "Real Estate Agents" }, { name: "Builders & Developers" }, { name: "PG for Men" }, { name: "PG for Women" }, { name: "Hostels" }, { name: "Rent/Lease Properties" }, { name: "Architects" }, { name: "Civil Contractors" }, { name: "Property Evaluators" }, { name: "Vastu Consultants" },

            // --- PROFESSIONAL SERVICES (15) ---
            { name: "Chartered Accountants (CA)" }, { name: "Lawyers & Advocates" }, { name: "Tax Consultants (GST/ITR)" }, { name: "IT Companies" }, { name: "Web Designers" }, { name: "Digital Marketing Agencies" }, { name: "Graphic Designers" }, { name: "Courier Services" }, { name: "Security Guards Services" }, { name: "Manpower Agencies" }, { name: "Printing Services" }, { name: "Advertising Agencies" }, { name: "detective Agencies" }, { name: "Insurance Agents" }, { name: "Passport Consultants" },

            // --- EVENTS & WEDDING (10) ---
            { name: "Wedding Planners" }, { name: "Event Managers" }, { name: "Caterers" }, { name: "Photographers" }, { name: "Video Editors" }, { name: "Banquet Halls" }, { name: "Decorators" }, { name: "Flower Decorators" }, { name: "Sound & Light Systems" }, { name: "Makeup Artists" },

            // --- RETAIL & SHOPPING (15) ---
            { name: "Mobile Phone Shops" }, { name: "Electronic Goods Showrooms" }, { name: "Jewellery Showrooms" }, { name: "Furniture Dealers" }, { name: "Clothing Stores" }, { name: "Footwear Shops" }, { name: "Gift Shops" }, { name: "Toy Stores" }, { name: "Computer/Laptop Dealers" }, { name: "Hardware Shops" }, { name: "Sanitaryware Dealers" }, { name: "Tile Dealers" }, { name: "Kitchenware Shops" }, { name: "Supermarkets" }, { name: "Stationery Shops" }
        ];

        await Category.deleteMany();
        const createdCategories = await Category.insertMany(categories);
        res.status(201).json({
            message: `${createdCategories.length} Mega Categories Seeded Successfully!`,
            data: createdCategories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};