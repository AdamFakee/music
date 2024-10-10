import { Request, Response, NextFunction } from "express";
import { uploadCloudinary } from "../../helper/uploadCloudinary.helper";

export const uploadSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if(req["file"]) {
    const link = await uploadCloudinary(req["file"].buffer);
    req.body[req["file"].fieldname] = link;
    next();
  } else {
    next();
  }
}

export const uploadField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if(req['files']) {
    for (const key in req["files"]) {
      let link = [];
      for (const item of req["files"][key]) {
        try {
          const url = await uploadCloudinary(item.buffer);
          link.push(url)
        } catch (error) {
          console.log(error);
        }
      }
      req.body[key] = link;
    }
  }
  next();
}