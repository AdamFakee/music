import * as controller from '../../controller/admin/song.controller';
import {uploadField} from '../../middleware/admin/uploadCloud.middleware';
import { Router } from "express";
import multer from 'multer';

const upload = multer();
const cpUpload = upload.fields([{ name: 'imgs', maxCount: 6 }, { name: 'audio', maxCount: 1 }])

const router: Router = Router();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', cpUpload, uploadField, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', cpUpload, uploadField, controller.editPatch);

export const songRouter: Router = router;