'use client';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Recipe } from '@/lib/types';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function AddRecipe({
  existingRecipe,
}: {
  existingRecipe: Recipe | null;
}) {
  const [recipe, setRecipe] = useState<Recipe>(
    existingRecipe || {
      recipeName: '',
      time: NaN,
      ingredients: [],
      instructions: [],
    },
  );

  const validRecipe =
    (recipe.recipeName &&
      recipe.time &&
      recipe.ingredients.length > 0 &&
      recipe.instructions.length > 0) ||
    false;

  // Handle input changes
  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setRecipe({ ...recipe, [e.target.id]: e.target.value });
  };

  //  Detect enter key press on input
  const ingredientInputRef = useRef<HTMLInputElement>(null);
  const instructionInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.currentTarget.id === 'ingredients') {
        if (ingredientInputRef.current?.value) {
          handleAddItem('ingredients', ingredientInputRef.current?.value);
        }
      } else if (e.currentTarget.id === 'instructions') {
        if (instructionInputRef.current?.value) {
          handleAddItem('instructions', instructionInputRef.current?.value);
        }
      }
    }
  };

  // Handle adding an ingredient
  const handleAddIngredient: MouseEventHandler<HTMLButtonElement> = () => {
    if (ingredientInputRef.current?.value) {
      handleAddItem('ingredients', ingredientInputRef.current?.value);
    }
  };

  // Handle adding an instruction
  const handleAddInstruction: MouseEventHandler<HTMLButtonElement> = () => {
    if (instructionInputRef.current?.value) {
      handleAddItem('instructions', instructionInputRef.current?.value);
    }
  };

  // Handle adding an item to the recipe
  const handleAddItem = (
    type: 'ingredients' | 'instructions',
    value: string,
  ) => {
    setRecipe({
      ...recipe,
      [type]: [...recipe[type], value],
    });
    if (type === 'ingredients') {
      ingredientInputRef.current?.focus();
      ingredientInputRef.current!.value = '';
    } else {
      instructionInputRef.current?.focus();
      instructionInputRef.current!.value = '';
    }
  };

  // Handle removing an item
  const handleRemoveItem = (
    type: 'ingredients' | 'instructions',
    index: number,
  ) => {
    setRecipe({
      ...recipe,
      [type]: recipe[type].filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Add the recipe to the database
    const addRecipeReq = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    if (!addRecipeReq.ok) {
      toast.error('Failed to add recipe');
      return;
    }

    toast.success('Recipe added successfully');

    setRecipe({
      recipeName: '',
      time: NaN,
      ingredients: [],
      instructions: [],
    });
  };

  // Fill the form with existing recipe data
  useEffect(() => {
    if (existingRecipe) {
      setRecipe(existingRecipe);
    }
  }, [existingRecipe]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Recipe</CardTitle>
        <CardDescription>Add a new recipe to the database.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Recipe name */}
        <div className="space-y-1">
          <Label htmlFor="recipeName">Recipe Name</Label>
          <Input
            id="recipeName"
            placeholder="Pasta"
            onChange={handleInputChange}
            value={recipe.recipeName}
          />
        </div>
        {/* Cook time */}
        <div className="space-y-1">
          <Label htmlFor="time">Time: (mins)</Label>
          <Input
            id="time"
            placeholder="45"
            type="number"
            onChange={handleInputChange}
            value={recipe.time as number}
          />
        </div>
        {/* Ingredients */}
        <div className="space-y-1">
          <Label htmlFor="ingredients">Ingredients</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter an ingredient and press the add button, or press enter
          </p>
          <div className="flex items-center space-x-2">
            <Input
              id="ingredients"
              placeholder="Tomatoes"
              onKeyDown={handleKeyDown}
              ref={ingredientInputRef}
            />
            <Button
              size={'icon'}
              variant={'secondary'}
              onClick={handleAddIngredient}
            >
              <Plus />
            </Button>
          </div>
          {/* Ingredient list */}
          <div>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="ml-8 cursor-pointer list-disc hover:line-through"
                  onClick={() => handleRemoveItem('ingredients', index)}
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Instructions */}
        <div className="space-y-1">
          <Label htmlFor="instructions">Instructions</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter an instruction and press the add button, or press enter
          </p>
          <div className="flex items-center space-x-2">
            <Input
              id="instructions"
              placeholder="Boil water"
              onKeyDown={handleKeyDown}
              ref={instructionInputRef}
            />
            <Button
              size={'icon'}
              variant={'secondary'}
              onClick={handleAddInstruction}
            >
              <Plus />
            </Button>
          </div>
          {/* Instruction list */}
          <div>
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="ml-8 cursor-pointer list-decimal hover:line-through"
                  onClick={() => handleRemoveItem('instructions', index)}
                >
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!validRecipe} onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
