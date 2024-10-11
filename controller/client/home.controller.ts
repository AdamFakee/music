import { Request, Response } from "express";
import {Song} from '../../model/song.model';
import { jsonParseHelper } from "../../helper/jsonParse.helper";

export const index = async (req: Request, res: Response) => {
    const songs = await Song.findAll({  // lấy mấy bài vừa thêm vào gần đây nhất 
        order : [
            ['id', 'desc']
        ],
        limit : 6,
        where : {
            status : 'active',
            deleted : false,
        },
        raw : true,
    });
    jsonParseHelper(songs);
    res.render('client/page/home/index.pug', {
        songs : songs,
    })
}

