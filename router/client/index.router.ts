import {Express} from 'express';
import {songRouter} from './song.router';
import {searchRouter} from './search.router';
import {homeRouter} from './home.router';

export const routerClient = (app: Express) => {
    app.use('/song', songRouter);
    app.use('/search', searchRouter);
    app.use('/', homeRouter);
}
