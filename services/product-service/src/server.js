const {app}=require('./app');app.listen(process.env.PORT||3001,()=>console.log('Product Service running on '+(process.env.PORT||3001)));
