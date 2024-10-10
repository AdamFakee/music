import { Request, Response } from "express";
import {Song} from '../../model/song.model';
import { Album } from "../../model/album.model";
import { Singer } from "../../model/singer.model";
import { albumSingerSong } from "../../model/album-singer-song.model";
import { jsonParseHelper } from "../../helper/jsonParse.helper";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /admin/song
export const index = async (req: Request, res: Response): Promise<void> => {
    const songs = await Song.findAll({
        where : {
            status : 'active',
            deleted : false,
        },
        raw : true
    });
    jsonParseHelper(songs);
    console.log(songs)
    res.render('admin/page/song/index', {
        songs : songs,
    })
}

// [GET] /admin/song/create
export const create = async (req: Request, res: Response) => {
    const albums = await Album.findAll({
        where : {
            status : 'active',
            deleted : false,
        },
        raw : true
    });
    const singers = await Singer.findAll({
        where : {
            status : true,
            deleted : false,
        },
        raw : true
    });
    res.render('admin/page/song/create', {
        albums : albums,
        singers : singers
    });
}

// [POST] /admin/song/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    if(req.body['imgs']) {
        req.body['imgs'] = JSON.stringify(req.body['imgs']);
    }
    req.body['audio'] = req.body['audio'][0];
    console.log(req.body)
    const newSong = await Song.create(req.body);
    const newSongId = newSong.dataValues.id;

    if(!req.body['albumId']) { // song does not belong to any albums
        await albumSingerSong.create({
            songId : newSongId,
            singerId : req.body['singerId']
        })
    } else {  // song belongs to album
        await albumSingerSong.create({ 
            songId : newSongId,
            singerId : req.body['singerId'],
            albumId : req.body['albumId']
        })
    }

    res.redirect('back');
}

let albumSingerSongs; // lưu thông tin của bảng join để truy vấn khi cập nhật [PATCH]
// [GET] /admin/song/edit/:id
export const edit = async (req: Request, res: Response) => {
    const songId = req.params.id;
    const song = await Song.findOne({
        where : {
            id : songId,
            status : 'active',
            deleted : false
        },
        raw : true
    });
    if(song['imgs']) {
        song['imgs'] = JSON.parse(song['imgs']) // chuyển ảnh về thành mảng
    }

    const albums = await Album.findAll({
        where : {
            status : 'active',
            deleted : false
        },
        raw : true
    });

    const singers = await Singer.findAll({
        where : {
            status : true,
            deleted : false
        },
        raw : true
    });

    // truy vấn bảng trung gian chứa albumId + songId của bài hát hiện tại
    albumSingerSongs = await sequelize.query(`
        select album_singer_song.id, album_singer_song.singerId, album_singer_song.albumId from songs
        join album_singer_song on album_singer_song.songId = ${songId}
    `, {
        type : QueryTypes.SELECT
    });
    res.render('admin/page/song/edit', {
        song : song,
        albums : albums,
        singers : singers,
        albumSingerSongs : albumSingerSongs[0]
    });
}

// [PATCH] /admin/song/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    albumSingerSongs = albumSingerSongs[0]; // lấy ra bản ghi
    const albumId = parseInt(req.body['albumId']); 
    const singerId = parseInt(req.body['singerId']);
    if(albumId != albumSingerSongs.albumId || singerId != albumSingerSongs.singerId) { // trùng thì thôi khỏi update
        await albumSingerSong.update({
            albumId : albumId,
            singerId : singerId
        }, {
            where : {
                id : albumSingerSongs.id
            }
        });
        albumSingerSongs = undefined;  // cập nhật lại thành rỗng 
    };
    const contentUpdated = {};
    for(let key in req.body){
        if(req.body[key]) {
            contentUpdated[key] = req.body[key];
        }
    }
    await Song.update(
        req.body, 
        {
            where : {
                id : req.params.id,
                status : 'active',
                deleted : false,
            }
        }
    )
    res.redirect('back');
}