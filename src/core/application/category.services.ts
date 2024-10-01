import { AppRepository } from '../domain/app.domain';
import { Category } from '@/definitions';

export default class CategoryService {
  constructor(private readonly repository: AppRepository<Category>) {}

  async getCategoryList() {
    return await this.repository.getList();
  }

  async getCategoryById(id: number) {
    return await this.repository.getById(id);
  }

  async updatePartiallyCategory(id: number, category: Partial<Category>) {
    return await this.repository.update(id, category);
  }

  async deleteCategory(id: number) {
    return await this.repository.delete(id);
  }

  async createNewCategory(category: Category) {
    return await this.repository.add(category);
  }
}
