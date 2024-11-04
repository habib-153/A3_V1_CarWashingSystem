"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const slot_controller_1 = require("./slot.controller");
const router = express_1.default.Router();
router.get('/availability', slot_controller_1.SlotController.getAvailableSlots);
router.get('/:id', slot_controller_1.SlotController.getSingleSlot);
router.put('/:id', slot_controller_1.SlotController.updateSlotStatus);
exports.SlotRoutes = router;
