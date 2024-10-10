import sequelize from '../config/database';
import {DataTypes} from 'sequelize';

// bài hát nào có album => lưu vô đây
const albumSingerSongSchema = sequelize.define('album_singer_song', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
    },
    singerId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'singers',
            key : 'id'
        }
    },
    songId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'songs',
            key : 'id'
        }
    },
    albumId : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'albums',
            key : 'id'
        }
    }
},  { 
    timestamps : true,
    tableName : 'album_singer_song'
})



export const albumSingerSong = albumSingerSongSchema;