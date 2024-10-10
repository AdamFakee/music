import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import {systemConfig} from './config/system';
import {routerAdmin} from './router/admin/index.router';
import {routerClient} from './router/client/index.router';
import bodyParser from 'body-parser';
import methodOverride  from 'method-override';
dotenv.config();
const app: Express = express();
const port: String | number = process.env.PORT || 3000;


// connect database
sequelize;
// End connect databas


// admin 
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// method-over-ride
app.use(methodOverride('_method'))


// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// set pug
app.set('views', `./views`); // biến dirname : trên onl sẽ k bt đứng tại thư mục nào nên cần truy vấn từ thư mực gốc
app.set('view engine', 'pug');


// public
app.use(express.static(`./public`));


// router
routerClient(app);
routerAdmin(app);


// End router
app.listen(port, () => {
    console.log(`running ${port}`);
})