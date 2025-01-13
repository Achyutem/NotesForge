import { NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import Todo from "@/app/(models)/todos";

export async function POST() {
  try {
    await dbConnect();

    const existingTodos = await Todo.find();

    return NextResponse.json({
      response: existingTodos,
      message: 'Fetching successful',
    });
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
