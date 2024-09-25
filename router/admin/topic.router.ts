import * as controller from '../../controller/admin/topic.controller';
import { Router } from "express";
import {uploadSingle} from '../../middleware/admin/uploadCloud.middleware';
import multer from 'multer';

const upload = multer();

const router: Router = Router();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('avatar'), uploadSingle, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.single('avatar'), uploadSingle, controller.editPatch);

export const topicRouter: Router = router;