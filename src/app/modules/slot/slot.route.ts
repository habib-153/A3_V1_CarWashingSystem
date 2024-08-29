import express from 'express';
import { SlotController } from './slot.controller';

const router = express.Router()

router.get('/availability', SlotController.getAvailableSlots)
router.get('/:id', SlotController.getSingleSlot)
router.put('/:id', SlotController.updateSlotStatus)

export const SlotRoutes = router