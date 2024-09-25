import { Request, Response } from "express";
import {Song} from '../../model/song.model';
import unidecode from 'unidecode';
import {Op} from 'sequelize';

// [GET] /search
export const index = async (req: Request, res: Response) => {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`;
    const song = [];
    if(keyword){
        let keywordSlug = keyword.trim();
        keywordSlug = keywordSlug.replace(/\s/g, "-"); // thay thế tất cả khoảng trống = dấu '-'
        keywordSlug = keywordSlug.replace(/-+/g, "-"); // giữ lại duy nhất 1 dấu '-' giữa 2 chữ
        keywordSlug = unidecode(keywordSlug);  // dùng chữ cái theo bảng chữ cái tiếng anh không dấu
        
        const result = await Song.findAll({
            limit : 10,
            where : {
                [Op.or]: [
                    {slug : {
                        [Op.regexp] : keywordSlug
                    }},
                    {title : {
                        [Op.regexp] : keyword
                    }}
                ],
            },
            raw : true,
        })
        result.forEach(item => {
            song.push({
                title : item['title'],
                singer : item['singer'],
                avatar : item['avatar'],
                id : item['id']
            })
        })
    } 
    if(type=='result'){  // router này hiển thị kết quả tìm kiếm
        res.render('client/page/search/index.pug',{
            song : song,
        })
    } else if(type=='sugguest') { // router này hiển thị gợi ý trong khi tìm kiếm
        res.json({
            code : 200,
            song : song
        })
    } else {
        res.json({
            code : 400
        })
    }
    
}