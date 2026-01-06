import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../service/category-service";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../model/category-model";

export class CategoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateCategoryRequest = req.body as CreateCategoryRequest;
      const response = await CategoryService.create(request);
      
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateCategoryRequest = {
        id: Number(req.params.categoryId),
        name: req.body.name,
      };
      const response = await CategoryService.update(request);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.categoryId);
      const response = await CategoryService.delete(categoryId);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.categoryId);
      const response = await CategoryService.get(categoryId);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CategoryService.getAll();
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
