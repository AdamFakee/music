import { Request, Response } from "express";
import {Topic} from '../../model/topic.model';
import slug from "slug";

// [GET] /admin/topic
export const index = async (req: Request, res: Response): Promise<void> => {
    const topic = await Topic.findAll();
    res.render('admin/page/topic/index', {
        topic : topic
    })
}

// [GET] /admin/topic/create
export const create = (req: Request, res: Response) => {
    res.render('admin/page/topic/create');
}

// [POST] /admin/topic/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    const slugTitle = slug(req.body['title']);
    req.body['slug'] = slugTitle;
    await Topic.create(req.body);
    res.redirect('back');
}

// [GET] /admin/topic/edit/:id
export const edit = async (req: Request, res: Response) => {
    const topicId = req.params.id;
    const topic = await Topic.findOne({
        where : {
            id : topicId
        }
    });
    res.render('admin/page/topic/edit', {
        topic : topic,
    });
}

// [PATCH] /admin/topic/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
    const slugTitle = slug(req.body['title']);
    req.body['slug'] = slugTitle;
    await Topic.update(
        req.body, 
        {
            where : {
                id : req.params.id
            }
        }
    )
    res.redirect('back');
}