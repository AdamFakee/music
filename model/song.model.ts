import sequelize from '../config/database';
import {DataTypes} from 'sequelize';

const songSchema = sequelize.define('song', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    singer : DataTypes.STRING,
    topic : DataTypes.STRING,
    audio : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    avatar : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    lyric : DataTypes.STRING,
    status : {
        type : DataTypes.STRING,
        defaultValue: true
    },
    slug : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    deleted : {
        type : DataTypes.STRING,
        defaultValue : false,
    }
},  { 
    timestamps : true,
    tableName : 'song'
})


export const Song = songSchema;