const {app}=require('./app');app.listen(process.env.PORT||3003,()=>console.log('Order Service running on '+(process.env.PORT||3003)));
