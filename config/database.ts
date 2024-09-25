import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
    'music', // tên database
    'root', // username
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