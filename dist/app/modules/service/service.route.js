"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const service_validation_1 = require("./service.validation");
const service_controller_1 = require("./service.controller");
const slot_validation_1 = require("../slot/slot.validation");
const slot_controller_1 = require("../slot/slot.controller");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('admin'), multer_config_1.multerUpload.fields([{ name: "Images" }]), bodyParser_1.parseBody, (0, validateRequest_1.default)(service_validation_1.ServiceValidation.createServiceValidationSchema), service_controller_1.ServiceController.createService);
router.get('/', service_controller_1.ServiceController.getAllServices);
router.get('/:id', service_controller_1.ServiceController.getSingleService);
router.put('/:id', (0, auth_1.default)('admin'), multer_config_1.multerUpload.fields([{ name: 'Images' }]), bodyParser_1.parseBody, (0, validateRequest_1.default)(service_validation_1.ServiceValidation.updateServiceValidationSchema), service_controller_1.ServiceController.updateService);
router.delete('/:id', (0, auth_1.default)('admin'), service_controller_1.ServiceController.deleteService);
// slot create route
router.post('/slots', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(slot_validation_1.SlotValidation.createSlotValidationSchema), slot_controller_1.SlotController.createSlots);
exports.ServiceRoutes = router;
