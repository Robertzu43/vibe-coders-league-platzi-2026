export interface Product {
  name: string;
  type: 'laptop' | 'desktop';
  profile: string[];
  price: number;
  specs: string;
}

export const catalog: Product[] = [
  {
    name: 'MacBook Air M3',
    type: 'laptop',
    profile: ['básico'],
    price: 999,
    specs: 'M3, 8GB, 256GB SSD, 15h batería',
  },
  {
    name: 'Lenovo IdeaPad 3',
    type: 'laptop',
    profile: ['básico'],
    price: 449,
    specs: 'Ryzen 5, 8GB, 256GB SSD',
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    type: 'laptop',
    profile: ['productividad', 'diseño/video'],
    price: 1999,
    specs: 'M3 Pro, 18GB, 512GB SSD',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    type: 'laptop',
    profile: ['productividad'],
    price: 1399,
    specs: 'i7-1365U, 16GB, 512GB SSD',
  },
  {
    name: 'Dell XPS 15',
    type: 'laptop',
    profile: ['desarrollo', 'diseño/video'],
    price: 1599,
    specs: 'i7-13700H, 16GB, 512GB SSD, RTX 4050',
  },
  {
    name: 'ASUS ROG Strix G16',
    type: 'laptop',
    profile: ['gaming'],
    price: 1499,
    specs: 'i9-13980HX, 16GB, 1TB SSD, RTX 4060',
  },
  {
    name: 'MSI Raider GE78',
    type: 'laptop',
    profile: ['gaming'],
    price: 2299,
    specs: 'i9-13950HX, 32GB, 1TB SSD, RTX 4080',
  },
  {
    name: 'Mac Mini M3',
    type: 'desktop',
    profile: ['básico', 'productividad'],
    price: 599,
    specs: 'M3, 8GB, 256GB SSD',
  },
  {
    name: 'Dell OptiPlex 7010',
    type: 'desktop',
    profile: ['productividad'],
    price: 849,
    specs: 'i5-13500, 16GB, 512GB SSD',
  },
  {
    name: 'Custom Gaming PC',
    type: 'desktop',
    profile: ['gaming'],
    price: 1899,
    specs: 'Ryzen 7 7800X3D, 32GB, 1TB, RTX 4070 Ti',
  },
];
