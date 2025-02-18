import { auth } from '@/app/auth';
import client from '@/lib/db';
import { Recipe } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // // Get query parameters
  // const { q } = Object.fromEntries(req.nextUrl.searchParams);

  // Get recipes with user info
  const recipes = (
    await client
      .db('test')
      .collection('recipes')
      .aggregate([
        {
          $addFields: {
            userId: { $toObjectId: '$userId' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: { path: '$author', preserveNullAndEmptyArrays: true },
        },
      ])
      .toArray()
  ).map((recipe) => ({
    id: recipe._id.toString(),
    recipeName: recipe.recipeName as string,
    time: recipe.time as number,
    ingredients: recipe.ingredients as string[],
    instructions: recipe.instructions as string[],
    userData: {
      id: recipe.author?._id.toString() as string,
      name: recipe.author?.name as string,
      image: recipe.author?.image as string,
    },
  })) as Recipe[];

  return NextResponse.json(recipes);
}

export async function POST(req: NextRequest) {
  // Check auth
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipeName, time, ingredients, instructions } = await req.json();

  const recipe = {
    recipeName,
    time,
    ingredients,
    instructions,
    userId: session.user.id,
  };

  const { insertedId } = await client
    .db('test')
    .collection('recipes')
    .insertOne(recipe);

  return NextResponse.json({
    id: insertedId.toString(),
    ...recipe,
  });
}

export async function DELETE(req: NextRequest) {
  // Check auth
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = Object.fromEntries(req.nextUrl.searchParams);

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  await client
    .db('test')
    .collection('recipes')
    .deleteOne({ _id: ObjectId.createFromHexString(id) });

  return NextResponse.json({ success: true });
}
