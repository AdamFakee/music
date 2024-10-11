import { Request, Response } from "express";
import sequelize from '../../config/database';
import {Op,QueryTypes} from 'sequelize';
import {Song} from '../../model/song.model';
import { jsonParseHelper, jsonParseHelperNotInLoop } from "../../helper/jsonParse.helper";


// [GET] /song/detail/:slug
export const detail = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const song = await Song.findOne({
        where : {
            slug : slug,
            deleted : false,
            status : 'active'
        },
        raw : true
    });
    if(!song) {
        res.redirect('/');
        return;
    }
    jsonParseHelperNotInLoop(song);
    res.render('client/page/song/detail.pug', {
        song : song,
    })
}

// [POST] /song/random
export const random = async (req: Request, res: Response) => {
    const audioId = req.body['audioId']; // audio mà client đang nghe
    const song = await Song.findOne({
        where : {
            id : {
                [Op.ne] : audioId
            }
        },
        order : sequelize.random(),
        raw : true
    });

    if(!song) {
        res.json({
            code : 400
        });
        return;
    }

    res.json({
        code : 200,
        song : song
    });
}

// [GET] /song/previous-audio/:type
export const previousAudio = async (req: Request, res: Response) => {
    const type = req.params.type; 
    // check router
    if(type != 'nomal' && type !='queue') {
        res.json({
            code : 400
        });
        return;
    }
    // End check router

    if(type == 'queue') {  // check router cụ thể
        const songId = `${req.query.songId}`; // id bài trong hàng đợi
        const preSong = await Song.findOne({
            where : {
                id : songId
            },
            raw : true
        })
        if(preSong) {
            res.json({
                code : 200,
                song : preSong,
            });
            return;
        } else {
            res.json({
                code : 400
            });
            return;
        }
    }
    const audioCurrentId = `${req.query.audioCurrentId}`;
    const song = await sequelize.query(   // bài hát trước đó trong databse
        `select id, audio from songs
        where id  < ${audioCurrentId} and status = 'active' and deleted = false
        order by id desc
        limit 1`, {
            type : QueryTypes.SELECT
        }
    )
    if(song.length) {
        res.json({
            code : 200,
            song : song[0],
        })
    } else {
        // nếu k có previous-audio thì trả về audio cuối cùng trong database
        const lastSong = await sequelize.query(
            `
            select id, audio from songs
            where status = 'active' and deleted = false
            order by id desc
            limit 1`, {
                type : QueryTypes.SELECT
            }
        )
        res.json({
            code : 200,
            song : lastSong[0]
        })
    }
}

// [GET] /song/next-audio
export const nextAudio = async (req: Request, res: Response) => {
    const type = req.params.type; 
    // check router
    if(type != 'nomal' && type !='queue') {
        res.json({
            code : 400
        });
        return;
    }
    // End check router

    if(type == 'queue') {
        const songId = `${req.query.songId}`;
        const preSong = await Song.findOne({
            where : {
                id : songId,
                status : 'active',
                deleted : false,
            },
            raw : true
        })
        if(preSong) {
            res.json({
                code : 200,
                song : preSong,
            });
            return;
        } else {
            res.json({
                code : 400
            });
            return;
        }
    }
    const audioCurrentId = `${req.query.audioCurrentId}`;  // audio đang phát 
    const song = await Song.findOne({
        where : {
            id : {
                [Op.gt] : audioCurrentId
            },
            status : 'active',
            deleted : false,
        },
        raw : true
    })
    if(song) {
        res.json({
            code : 200,
            song : song
        })
    } else {
        const lastSong = await Song.findOne({ // nếu không có bài nào nữa thì trả về audio đầu tiên trong database
            where : {
                status : "active",
                deleted : false,
            }
        })
        if(lastSong) {
            res.json({
                code : 200,
                song : lastSong
            })
        } else {
            res.json({
                code : 400
            })
        }
    }
}