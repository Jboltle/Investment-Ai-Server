"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const service = __importStar(require("../Service/service"));
exports.router = express_1.default.Router();
// Create user in database
exports.router.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await service.getUser(userId);
    if (!user) {
        res.status(404).json({ error: `User not found ${user}` });
    }
    else {
        console.log(user);
        res.status(200).json({ "data": user });
    }
});
exports.router.get('/quote/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const quote = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
    const data = await quote.json();
    res.json(data);
});
exports.router.post('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email } = req.body;
        const result = await service.createUser(userId, username, email);
        res.status(201).json({ message: 'User created successfully', user: result });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
exports.router.get('/stocks/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = await service.getUser(userId);
    res.json({ "watchlist": data?.watchlist });
});
exports.router.post('/stocks/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const symbol = req.body;
        // Validate that symbol is an array
        const watchlist = await service.updateStocks(userId, symbol);
        res.json(watchlist);
    }
    catch (error) {
        console.error('Error updating watchlist:', error);
        res.status(500).json({ error: 'Failed to update watchlist' });
    }
});
