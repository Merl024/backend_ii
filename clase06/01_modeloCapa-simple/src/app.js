import express from 'express';
import routerProduct from './router/product.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());

// ROUTER
app.use('/api', routerProduct)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
})