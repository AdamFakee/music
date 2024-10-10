import * as controller from '../../controller/admin/album.controller';
import { Router } from "express";
import {uploadField} from '../../middleware/admin/uploadCloud.middleware';
import multer from 'multer';

const upload = multer();

const router: Router = Router();

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.fields([{ name: 'imgs', maxCount: 6 }]), uploadField, controller.createPost);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id', upload.fields([{ name: 'imgs', maxCount: 6 }]), uploadField, controller.editPatch);

export const topicRouter: Router = router;