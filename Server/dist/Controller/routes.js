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
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
dotenv_1.default.config({ path: '../../.env' });
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
exports.router.get('/predict/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const data = await fetch(`https://investment-model-production.up.railway.app/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "symbol": symbol })
    });
    const result = await data.json();
    res.json(result);
});
exports.router.get('/research/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const bear = await openai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `Analyze ${symbol} stock with a bearish perspective. Focus on:
1. Key risks and challenges facing the company
2. Negative market trends affecting their business
3. Competitive threats
4. Financial weaknesses or concerns
5. Recent negative developments

Do not respond with any other text than the summary. Provide a concise, bullet point summary highlighting the main bearish arguments. Do not cite sources in summary, and do not include any dates in your response just relevent news information that could detemrine the sentiment of the underlying stock.

The summary should be in this template here 

1. **Key Risks and Challenges**: NVIDIA faces substantial risks from geopolitical tensions, especially related to U.S.-China relations, which could impact sales and supply chains. Regulatory scrutiny over acquisitions and data privacy issues also pose challenges.

2. **Negative Market Trends**: The semiconductor industry is prone to cyclical downturns, with potential decreases in demand for consumer electronics and data centers impacting revenue. Supply chain disruptions and price volatility for raw materials exacerbate these challenges.

3. **Competitive Threats**: NVIDIA encounters fierce competition from companies like AMD and Intel, which continue to develop high-performance alternatives. The rise of custom silicon by big tech companies such as Apple and Google further threatens NVIDIA's market share.

4. **Financial Weaknesses or Concerns**: Rising R&D expenses and capital expenditures might pressure margins, and any delays in technological innovation could affect profitability. Overreliance on specific market segments, such as gaming, leaves NVIDIA vulnerable to shifts in consumer demand.

5. **Recent Negative Developments**: NVIDIA has faced setbacks in scaling its recent AI initiatives, alongside regulatory challenges obstructing key strategic acquisitions, which limits growth potential and diversification efforts.

**Summary**: NVIDIA contends with significant geopolitical risks, cyclical market pressures, and intense competition affecting its core business areas. Financial pressures from high R&D costs and dependency on volatile markets exacerbate vulnerabilities. Recent regulatory hurdles and strategic missteps have further impeded its growth trajectory.


`
    });
    const bull = await openai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: `Analyze ${symbol} stock with a bullish perspective. Focus on:
1. Growth opportunities and market advantages
2. Strong fundamentals and financial metrics
3. Competitive strengths and moats
4. Positive industry trends
5. Recent positive developments

Provide a concise, bullet point summary highlighting the main bullish arguments. Do not cite sources in summary, and do not include any dates in your response just relevent news information that could detemrine the sentiment of the underlying stock.`
    });
    res.json({ bear: bear.output_text, bull: bull.output_text });
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
