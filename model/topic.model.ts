import sequelize from '../config/database';
import {DataTypes} from 'sequelize';

const topicSchema = sequelize.define('Topic', {
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
    avatar : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    status : {
        type : DataTypes.STRING,
        allowNull : false,
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
    tableName : 'topic'
})


export const Topic = topicSchema;