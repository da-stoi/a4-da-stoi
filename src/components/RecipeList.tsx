'use client';
import { Recipe } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function RecipeList({
  searchFilter,
  switchTab,
  fillAddRecipe,
}: {
  searchFilter?: string;
  switchTab?: (tab: string) => void;
  fillAddRecipe?: (recipe: Recipe) => void;
}) {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from the API
  const fetchRecipes = async () => {
    setLoading(true);
    const response = await fetch('/api/recipes');
    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      toast.error('Failed to fetch recipes');
      return;
    }

    setRecipes(data);
  };

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchFilter) return recipes;

    return recipes.filter(
      (recipe) =>
        recipe.recipeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchFilter.toLowerCase()),
        ),
    );
  }, [searchFilter, recipes]);

  const handleEditRecipe = (id: string) => {
    // Copy data to the add recipe form
    const recipe = recipes.find((r) => r.id === id);
    if (recipe) {
      fillAddRecipe?.(recipe);
    }
    // Switch to the add recipe tab
    switchTab?.('add-recipe');

    // Delete the recipe from the list
    handleDeleteRecipe(id, true);
  };

  // Handle deleting a recipe
  const handleDeleteRecipe = async (id: string, skipToast: boolean = false) => {
    const response = await fetch(`/api/recipes?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (!skipToast) {
        toast.error('Failed to delete recipe');
      }
      return;
    }

    if (!skipToast) {
      toast.success('Recipe deleted successfully');
    }

    fetchRecipes();
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // If the recipes are still loading
  if (loading) {
    return <Loader2 className="m-auto size-12 animate-spin" />;
  }

  return (
    <>
      {filteredRecipes.map((recipe: Recipe) => (
        <Card className="p-5" key={recipe.id}>
          <h2 className="text-2xl font-bold">{recipe.recipeName}</h2>
          <p className="italic">{recipe.time} minutes</p>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold">Ingredients</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Instructions</h3>
              <ol>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
          {session?.user && session?.user.id === recipe.userData?.id ? (
            <div className="mt-2 flex gap-2">
              <Button
                variant={'secondary'}
                onClick={() => recipe.id && handleEditRecipe(recipe.id)}
              >
                Edit
              </Button>
              <Button
                variant={'destructive'}
                onClick={() => recipe.id && handleDeleteRecipe(recipe.id)}
              >
                Delete
              </Button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={recipe.userData?.image || ''} />
                <AvatarFallback>
                  {recipe.userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <p>Recipe by: {recipe.userData?.name}</p>
            </div>
          )}
        </Card>
      ))}
    </>
  );
}
