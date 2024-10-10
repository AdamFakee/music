import { Request, Response } from "express";
import {Album} from '../../model/album.model';

// [GET] /admin/album
export const index = async (req: Request, res: Response): Promise<void> => {
    const albums = await Album.findAll({
        raw : true,
        where : {
            status : 'active',
            deleted : false
        }
    });
    albums.forEach(item => {
        if(item['imgs']) {
            item['imgs'] = JSON.parse(item['imgs'])
        }
    })
    console.log(albums)
    res.render('admin/page/album/index', {
        albums : albums
    })
}

// [GET] /admin/album/create
export const create = (req: Request, res: Response) => {
    res.render('admin/page/album/create');
}

// [POST] /admin/album/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    req.body['imgs'] = JSON.stringify(req.body['imgs']);
    console.log(req.body)
    await Album.create(req.body);
    res.redirect('back');
}

// [GET] /admin/album/edit/:id
export const edit = async (req: Request, res: Response) => {
    const album = await Album.findOne({
        where : {
            id : req.params.id,
            status : 'active',
            deleted : false
        },
        raw : true
    });
    album['imgs'] = JSON.parse(album['imgs']);
    res.render('admin/page/album/edit', {
        album : album,
    });
}

// [PATCH] /admin/album/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const contentUpdated = {};
    for(let key in req.body){
        if(req.body[key]) {
            contentUpdated[key] = req.body[key];
        }
    }
    await Album.update(
        contentUpdated, 
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