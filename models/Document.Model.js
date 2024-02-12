
const mongoose = require("mongoose");


const DocumentSchema = new mongoose.Schema({
    AcNumber: { type: String, required: [true, "AcNumber is required"] },

    document: { type: Number, required: [true, "document is required"] },
    Image: { type: String, required: [true, "image is required"] },
    type_at: {
        type: String, default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now, // Set default value to the current timestamp
    },
})

const DocumentModel = mongoose.model("documentverify", DocumentSchema)

module.exports = DocumentModel