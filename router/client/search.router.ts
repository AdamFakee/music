import express from "express";
import * as controller from '../../controller/client/search.controller';

const router = express.Router();

router.get('/:type', controller.index);

export const searchRouter = router;
