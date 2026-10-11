const {app}=require('./app');app.listen(process.env.PORT||3002,()=>console.log('Customer Service running on '+(process.env.PORT||3002)));
