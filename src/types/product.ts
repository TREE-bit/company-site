export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = {
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
};

export type UpdateProductInput = {
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
};
