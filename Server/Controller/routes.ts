import express, { Request, Response } from "express";
import * as service from '../Service/service'
import dotenv from 'dotenv';
import { OpenAI } from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

dotenv.config({ path:  '../../.env' });

export const router = express.Router();

// Create user in database
router.get('/users/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await service.getUser(userId);
    if (!user) {
        res.status(404).json({ error: `User not found ${user}` });
    } else {
        console.log(user);
        res.status(200).json({"data": user});
    }
});

router.get('/predict/:symbol', async (req: Request, res: Response) => {
    const symbol = req.params.symbol;
    const data = await fetch(`https://investment-model-production.up.railway.app/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"symbol": symbol})
    });
    const result = await data.json();
    res.json(result);
});

router.get('/research/:symbol', async (req: Request, res: Response) => {
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
    res.json({bear: bear.output_text, bull: bull.output_text});
});

router.get('/quote/:symbol', async (req: Request, res: Response) => {
    const symbol = req.params.symbol;
    const quote = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
    const data = await quote.json();
    res.json(data);
});



router.post('/users/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const {username, email } = req.body;
        
        const result = await service.createUser(userId, username, email);

        res.status(201).json({ message: 'User created successfully', user: result });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.get('/stocks/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = await service.getUser(userId);
    res.json({"watchlist": data?.watchlist});
});

router.post('/stocks/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const symbol = req.body;

        // Validate that symbol is an array
      
        const watchlist = await service.updateStocks(userId, symbol);
        res.json(watchlist);
    } catch (error) {
        console.error('Error updating watchlist:', error);
        res.status(500).json({ error: 'Failed to update watchlist' });
    }
});
