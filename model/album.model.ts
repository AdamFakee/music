import sequelize from '../config/database';
import {DataTypes} from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

const albumSchema = sequelize.define('album', {
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
    imgs : DataTypes.TEXT('long'),
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    status : {
        type : DataTypes.STRING,
        defaultValue: 'active'
    },
    deleted : {
        type : DataTypes.STRING,
        defaultValue : false,
    }
},  { 
    timestamps : true,
    tableName : 'albums'
})

SequelizeSlugify.slugifyModel(albumSchema, {
    source: ['name']
});


export const Album = albumSchema;