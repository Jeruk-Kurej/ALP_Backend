import { Response, NextFunction } from "express";
import { CategoryService } from "../service/category-service";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../model/category-model";
import { UserRequest } from "../model/user-request-model";

export class CategoryController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateCategoryRequest = {
        name: req.body.name,
        owner_id: req.user!.id,
      };
      const response = await CategoryService.create(request);
      
      res.status(201).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateCategoryRequest = {
        id: Number(req.params.categoryId),
        name: req.body.name,
      };
      const response = await CategoryService.update(request, req.user!.id);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.categoryId);
      const response = await CategoryService.delete(categoryId, req.user!.id);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const categoryId = Number(req.params.categoryId);
      const response = await CategoryService.get(categoryId, req.user!.id);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const response = await CategoryService.getAll(userId);
      
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
