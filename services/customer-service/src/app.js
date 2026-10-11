const express=require('express');const client=require('prom-client');const app=express();app.use(express.json());client.collectDefaultMetrics();
const customers=[{id:'c1',name:'Aarav Shah',email:'aarav@example.com'},{id:'c2',name:'Priya Patil',email:'priya@example.com'},{id:'c3',name:'Rahul Mehta',email:'rahul@example.com'}];
app.get('/health',(req,res)=>res.json({status:'UP',service:'customer-service'}));
app.get('/metrics',async(req,res)=>{res.set('Content-Type',client.register.contentType);res.end(await client.register.metrics())});
app.get('/customers',(req,res)=>res.json(customers));
app.get('/customers/:id',(req,res)=>{const c=customers.find(x=>x.id===req.params.id);if(!c)return res.status(404).json({error:'Customer not found'});res.json(c)});
app.post('/customers',(req,res)=>{const {name,email}=req.body;if(!name||!email)return res.status(400).json({error:'name and email are required'});const c={id:'c'+(customers.length+1),name,email};customers.push(c);res.status(201).json(c)});
module.exports={app,customers};
