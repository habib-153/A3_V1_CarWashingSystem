"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const mongoose_1 = require("mongoose");
const slot_constant_1 = require("./slot.constant");
const slotSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: String, enum: slot_constant_1.IsBooked, default: 'available' },
}, {
    timestamps: true,
});
// slotSchema.pre('find', function (next) {
//   this.find({ isBooked: { $ne: 'booked' } });
//   next();
// });
exports.Slot = (0, mongoose_1.model)('Slot', slotSchema);
