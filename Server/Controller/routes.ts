import express, { Request, Response } from "express";
import * as service from '../Service/service'


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
