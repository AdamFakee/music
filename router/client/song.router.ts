import express from "express";
import * as controller from '../../controller/client/song.controller';

const router = express.Router();

router.get("/detail/:slug", controller.detail);
router.post('/random', controller.random);
router.post('/queue/detail', controller.queueDetail);
router.get('/previous-audio/:type', controller.previousAudio); // có bài trong hàng đợi => type = stack
router.get('/next-audio/:type', controller.nextAudio); // có bài trong hàng đợi => type = queue, k có bài trong hàng đợi => type = nomal
export const songRouter = router;
