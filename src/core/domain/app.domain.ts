export interface AppRepository<T> {
  getList(): Promise<T[]>;
  getById(id: number): Promise<T>;
  add(data: T): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<T>;
}
