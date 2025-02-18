export type Recipe = {
  id?: string;
  recipeName: string;
  time: number;
  ingredients: string[];
  instructions: string[];
  userData?: {
    id: string;
    name: string;
    image: string;
  };
};
