export class CategoryAlreadyExistError extends Error {
  constructor() {
    super('Category already exist.')
  }
}
