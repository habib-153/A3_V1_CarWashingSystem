"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const booking_route_1 = require("./app/modules/booking/booking.route");
const app = (0, express_1.default)();
//const port = 3000
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ['http://localhost:5173', 'https://shine-slot-client.vercel.app'], credentials: true }));
//  application routes
app.use('/api', routes_1.default);
app.use('/api', booking_route_1.BookingRoutes);
app.get('/', (req, res) => {
    //const a = 10;
    res.send("Hello !! want to wash your car?");
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;