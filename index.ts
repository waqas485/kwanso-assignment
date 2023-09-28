require("dotenv").config();
import express from 'express'
import expressBusboy from 'express-busboy'
import ActionsRoutes from './routes'
const app = express();
expressBusboy.extend(app, {
  upload: true,
  path: './',
  allowedPath: /./,
});
app.use('/', ActionsRoutes);
app.use('/', (req,res)=>{
res.send('Assignment')
});
app.listen(3000, function () {
  console.log("info", 'Server is running at port : ' + 3000);
});

module.exports = app;
