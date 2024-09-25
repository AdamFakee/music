import express from "express";
import * as controller from '../../controller/client/song.controller';

const router = express.Router();

router.get("/detail/:id", controller.detail);
router.post('/random', controller.random);
router.get('/previous-audio', controller.previousAudio);
router.get('/next-audio', controller.nextAudio);
export const songRouter = router;
