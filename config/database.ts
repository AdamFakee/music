import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
 
const sequelize = new Sequelize(
    process.env.DATABASE_NAME, // tên database
    process.env.DATABASE_USER_NAME, // username
    process.env.DATABASE_PASSWORD, // password
    {
      host: process.env.DATABASE_HOST,
      dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Kết nối thành công!');
}).catch((error) => {
    console.error('Kết nối thất bại: ', error);
});

export default sequelize;