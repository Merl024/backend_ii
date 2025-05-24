import {Router} from 'express';

const router = Router();

// ESTO ES UN ROUTER BASE - customizando routers

router.get('/',(req,res)=>{
    res.render('index',{});
});


export default router;