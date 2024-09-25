import { Request, Response } from "express";
import {Song} from '../../model/song.model';

export const index = async (req: Request, res: Response) => {
    const listSong = await Song.findAll({
        raw : true,
    });
    res.render('client/page/home/index.pug', {
        song : listSong,
    })
}

