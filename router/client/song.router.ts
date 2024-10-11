import express from "express";
import * as controller from '../../controller/client/song.controller';

const router = express.Router();

router.get("/detail/:slug", controller.detail);
router.post('/random', controller.random);
router.get('/previous-audio/:type', controller.previousAudio); // có bài trong hàng đợi => type = queue
router.get('/next-audio/:type', controller.nextAudio); // k có bài trong hàng đợi => type = nomal
export const songRouter = router;
