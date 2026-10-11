const express=require('express');const client=require('prom-client');
const app=express();app.use(express.json());client.collectDefaultMetrics();
const products=[{id:'p1',name:'Laptop',description:'Student laptop',price:55000,stock:12},{id:'p2',name:'Wireless Mouse',description:'Ergonomic mouse',price:1200,stock:40},{id:'p3',name:'Mechanical Keyboard',description:'RGB keyboard',price:3500,stock:18},{id:'p4',name:'USB-C Hub',description:'7-in-1 adapter',price:2200,stock:25}];
app.get('/health',(req,res)=>res.json({status:'UP',service:'product-service'}));
app.get('/metrics',async(req,res)=>{res.set('Content-Type',client.register.contentType);res.end(await client.register.metrics())});
app.get('/products',(req,res)=>res.json(products));
app.get('/products/:id',(req,res)=>{const p=products.find(x=>x.id===req.params.id);if(!p)return res.status(404).json({error:'Product not found'});res.json(p)});
app.post('/products',(req,res)=>{const {name,description,price,stock}=req.body;if(!name||price==null)return res.status(400).json({error:'name and price are required'});const p={id:'p'+(products.length+1),name,description:description||'',price:Number(price),stock:Number(stock||0)};products.push(p);res.status(201).json(p)});
module.exports={app,products};
