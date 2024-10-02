import { Request, Response } from "express";
import sequelize from '../../config/database';
import {Op,QueryTypes} from 'sequelize';
import {Song} from '../../model/song.model';
import { raw } from "body-parser";


// [GET] /song/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id = req.params.id;
    const song = await Song.findOne({
        where : {
            id : id,
        },
        raw : true
    });
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

    if(type == 'queue') {
        const songId = `${req.query.songId}`;
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
    const idPreAudio = await sequelize.query(`  
        SELECT MAX(id) as id
        FROM song
        WHERE id < ${audioCurrentId};`, {
        type: QueryTypes.SELECT,
    });
    const song = await Song.findOne({ // previous-audio
        where : {
            id : idPreAudio[0]['id']
        },
        raw : true
    })
    if(song) {
        res.json({
            code : 200,
            song : song,
        })
    } else {
        // nếu k có previous-audio thì trả về audio cuối cùng trong database
        const idLastAudio = await sequelize.query(`
            SELECT MAX(id) as id, audio
            FROM song;`, {
            type: QueryTypes.SELECT,
        });
        const lastSong = await Song.findOne({  
            where : {
                id : idLastAudio[0]['id']
            },
            raw : true
        })
        res.json({
            code : 200,
            song : lastSong
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
    const idNextAudio = await sequelize.query(
        `SELECT MIN(id) as id, audio
        FROM song
        WHERE id > ${audioCurrentId};`,
        {
            raw : true,
            type: QueryTypes.SELECT,
        }
    );
    const song = await Song.findOne({ // next-audio
        where : {
            id : idNextAudio[0]['id']
        },
        raw : true,
    })
    if(song) {
        res.json({
            code : 200,
            song : song
        })
    } else {
        const idLastAudio = await sequelize.query( // nếu không có bài nào nữa thì trả về audio đầu tiên trong database
            `SELECT MIN(id) as id, audio
            FROM song;
            `, {
                type : QueryTypes.SELECT
            }
        );
        const lastSong = await Song.findOne({
            where : {
                id : idLastAudio[0]['id']
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