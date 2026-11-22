import { notFound } from "next/navigation"
import { isUUID } from "@/src/shared/utils/ids"
import { categoryRepository, ICategoryRepository,   } from "./CategoryRepository"


class CategoryService {
  constructor(
        private categoryRepository : ICategoryRepository
  ){}
  async getAllCategories() {
    return await this.categoryRepository.findAll()
  }
  async getCategoryById(categoryId: string) {
    if(!isUUID(categoryId)) notFound()
    const category = await this.categoryRepository.findById(categoryId)
    if(!category) notFound()
        return category

  }
}

export const categoryService = new CategoryService(categoryRepository)