import { Request, Response } from "express"
import sequelize from '../../config/database';
import {QueryTypes} from 'sequelize';
import {Singer} from '../../model/singer.model';

// [GET] /admin/singer
export const index = async (req: Request, res: Response) => {
    const singers = await sequelize.query(`
        select * from singers
        where status = true and deleted = false;
        `, {
            type: QueryTypes.SELECT
        })
    res.render('admin/page/singer/index.pug', {
        singers : singers
    })
}

// [GET] /admin/singer/create
export const create = (req: Request, res: Response) => {
    res.render('admin/page/singer/create.pug')
}

// [POST] /admin/singer/create
export const createPost = async (req: Request, res: Response) => {
    const contentUpdated = {};
    for(let key in req.body){
        if(req.body[key]) {
            contentUpdated[key] = req.body[key];
        }
    }
    await Singer.create(contentUpdated);
    res.redirect('back');
}

// [GET] /admin/singer/edit/:id
export const edit = async (req: Request, res: Response) => {
    const singer = await Singer.findOne({
        where : {
            id : req.params['id'],
            status : true,
            deleted : false,
        },
        raw : true,
    })
    res.render('admin/page/singer/edit.pug', {
        singer : singer
    })
}

// [PATCH] /admin/singer/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const contentUpdated = {};
    for(let key in req.body){
        if(req.body[key]) {
            contentUpdated[key] = req.body[key];
        }
    }
    await Singer.update(contentUpdated, {
        where : {
            id : req.params.id,
            status : true,
            deleted : false,
        }
    })
    res.redirect('back');
}

