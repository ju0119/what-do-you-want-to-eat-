export interface MenuItem {
  name: string;
  price: string;
}

export interface Restaurant {
  ranking: number;
  name: string;
  cuisine: string;
  address: string;
  description: string;
  review: string;
  menu: MenuItem[];
  hours: string;
  imagePrompt: string; // English description for generating an image
}