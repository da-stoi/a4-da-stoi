'use client';
import AddRecipe from '@/components/AddRecipe';
import Header from '@/components/Header';
import RecipeList from '@/components/RecipeList';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { data: session } = useSession();

  const [tab, setTab] = useState('recipe-list');
  const [search, setSearch] = useState('');
  const [addRecipe, setAddRecipe] = useState<Recipe>({
    recipeName: '',
    time: NaN,
    ingredients: [],
    instructions: [],
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl p-4">
        <h1 className="text-2xl font-bold">The all new Recipe App</h1>
        <p>
          Now in Next.js!{' '}
          <span className={cn(session?.user && 'hidden')}>
            The <b>Add Recipe</b> tab is disabled for unauthorized users. Sign
            in to add a recipe.
          </span>
        </p>

        <br />

        <Tabs defaultValue="recipe-list" value={tab} onValueChange={setTab}>
          <TabsList className="grid h-auto w-full grid-cols-3">
            <TabsTrigger
              className="text-md font-bold"
              value="add-recipe"
              disabled={!session?.user}
            >
              Add Recipe
            </TabsTrigger>
            <TabsTrigger className="text-md font-bold" value="recipe-list">
              Recipe List
            </TabsTrigger>
            <TabsTrigger className="text-md font-bold" value="search">
              Search
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add-recipe">
            <AddRecipe existingRecipe={addRecipe} />
          </TabsContent>
          <TabsContent value="recipe-list">
            <Card>
              <CardHeader>
                <CardTitle>Recipes</CardTitle>
                <CardDescription>List of all recipes.</CardDescription>
              </CardHeader>
              <CardContent className="flex max-h-128 flex-col gap-4 overflow-auto">
                <RecipeList fillAddRecipe={setAddRecipe} switchTab={setTab} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Search</CardTitle>
                <CardDescription>Search for your favorite.</CardDescription>
                <Label htmlFor="search">Search</Label>
                <Input
                  placeholder="Search for a recipe..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CardHeader>
              <CardContent className="flex max-h-128 flex-col gap-4 overflow-auto">
                <RecipeList
                  fillAddRecipe={setAddRecipe}
                  switchTab={setTab}
                  searchFilter={search}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="p-4 text-center text-sm">
        <p>
          Made with ❤️ by{' '}
          <Link
            href="https://danielstoiber.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Daniel Stoiber
          </Link>
        </p>
      </footer>
    </>
  );
}
