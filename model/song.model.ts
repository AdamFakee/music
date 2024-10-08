import sequelize from '../config/database';
import {DataTypes} from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

const songSchema = sequelize.define('song', {
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
    audio : DataTypes.TEXT('long'),
    lyric : DataTypes.TEXT('long'),
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    status : {
        type : DataTypes.STRING,
        defaultValue: true
    },
    deleted : {
        type : DataTypes.STRING,
        defaultValue : false,
    }
},  { 
    timestamps : true,
    tableName : 'songs'
})

SequelizeSlugify.slugifyModel(songSchema, {
    source: ['name']
});


export const Song = songSchema;