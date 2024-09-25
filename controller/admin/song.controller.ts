import { Request, Response } from "express";
import {Song} from '../../model/song.model';
import slug from "slug";
import { where } from "sequelize";

// [GET] /admin/song
export const index = async (req: Request, res: Response): Promise<void> => {
    const song = await Song.findAll();
    res.render('admin/page/song/index', {
        song : song
    })
}

// [GET] /admin/song/create
export const create = (req: Request, res: Response) => {
    res.render('admin/page/song/create');
}

// [POST] /admin/song/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    const slugTitle = slug(req.body['title']);
    req.body['slug'] = slugTitle;
    await Song.create(req.body);
    res.redirect('back');
}

// [GET] /admin/song/edit/:id
export const edit = async (req: Request, res: Response) => {
    const songId = req.params.id;
    const song = await Song.findOne({
        where : {
            id : songId
        }
    });
    res.render('admin/page/song/edit', {
        song : song,
    });
}

// [PATCH] /admin/song/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const slugTitle = slug(req.body['title']);
    req.body['slug'] = slugTitle;
    await Song.update(
        req.body, 
        {
            where : {
                id : req.params.id
            }
        }
    )
    res.redirect('back');
}