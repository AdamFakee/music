import { Express } from "express";
import { dashboardRouter } from "./dashboard.router";
import {songRouter} from './song.router';
import { topicRouter } from "./topic.router";
import { systemConfig } from "../../config/system";

export const routerAdmin = (app: Express): void => {

  const path = `/${systemConfig.prefixAdmin}`;

  app.use(`${path}/dashboard`, dashboardRouter);
  app.use(`${path}/song`, songRouter);
  app.use(`${path}/topic`, topicRouter);
};

