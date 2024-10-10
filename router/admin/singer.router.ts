import { Router } from "express";
import * as controller from '../../controller/admin/singer.controller';

import {uploadSingle} from '../../middleware/admin/uploadCloud.middleware';
import multer from 'multer';

const upload = multer();
const router: Router = Router();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('img'), uploadSingle, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('img'), uploadSingle, controller.editPatch);
export const singerRouter = router;