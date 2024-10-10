import sequelize from '../config/database';
import {DataTypes} from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

const singerSchema = sequelize.define('singer', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },
    name : {
        type : DataTypes.STRING(50),
        allowNull : false,
    },
    information : DataTypes.TEXT('long'),
    img : DataTypes.TEXT('long'),
    email : {
        type : DataTypes.STRING(50),
        allowNull : false,
        unique : true
    },
    sdt : {
        type : DataTypes.CHAR(10),
        unique : true,
    },
    slug: {
        type: DataTypes.STRING(250),
        unique: true
    },
    status : {
        type : DataTypes.STRING(30),
        defaultValue: true
    },
    deleted : {
        type : DataTypes.STRING(30),
        defaultValue : false,
    }
},  { 
    timestamps : true,
    tableName : 'singers'
})

SequelizeSlugify.slugifyModel(singerSchema, {
    source: ['name']
});


export const Singer = singerSchema;