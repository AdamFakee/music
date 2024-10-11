import { Request, Response } from "express";
import unidecode from 'unidecode';
import {QueryTypes} from 'sequelize';
import sequelize from "../../config/database";
import { jsonParseHelperNotInLoop } from "../../helper/jsonParse.helper";

// [GET] /search
export const index = async (req: Request, res: Response) => {
    const type = req.params.type; // type : result - in ra kết quả 
                                 // type : suggest - in ra gợi ý
    const keyword = `${req.query.keyword}`;
    const songs = [];  // mảng chứa kết quả 
    if(keyword){
        let keywordSlug = keyword.trim();
        keywordSlug = keywordSlug.replace(/\s/g, "-"); // thay thế tất cả khoảng trống = dấu '-'
        keywordSlug = keywordSlug.replace(/-+/g, "-"); // giữ lại duy nhất 1 dấu '-' giữa 2 chữ
        keywordSlug = unidecode(keywordSlug);  // dùng chữ cái theo bảng chữ cái tiếng anh không dấu
        
        const result = await sequelize.query(
            `
            select songs.name as songName, singers.name as singerName, songs.imgs, songs.information, songs.id, songs.slug from songs
            join album_singer_song on songs.id = album_singer_song.songId
            join singers on album_singer_song.singerId = singers.id
            where songs.name regexp '${keyword}' or songs.slug regexp '${keywordSlug}';
            `, {
                type: QueryTypes.SELECT
            }
        )
        result.forEach(item => { // k biết sao gán thẳng result lại báo 404
            jsonParseHelperNotInLoop(item); 
            songs.push({
                information : item['information'],
                songName : item['songName'],
                avatar : item['imgs'] ? item['imgs'][0] : undefined, // lấy 1 ảnh thôi
                id : item['id'],
                singerName : item['singerName'],
                slug : item['slug']
            })
        })
    } 
    if(type=='result'){  // router này hiển thị kết quả tìm kiếm
        res.render('client/page/search/index.pug',{
            songs : songs,
        })
    } else if(type=='sugguest') { // router này hiển thị gợi ý trong khi tìm kiếm
        if(songs.length <= 0) {   // songs rỗng
            res.json({
                code : 400,
            })
            return;
        }
        res.json({
            code : 200,
            songs : songs
        })
    } else {
        res.json({
            code : 400
        })
    }
    
}