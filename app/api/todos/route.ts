/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import Todo from "@/app/(models)/todos";

export async function GET() {
  try {
    await dbConnect();
    const existingTodos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json({ existingTodos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: any) {
  try {
    const { title, description, tags } = await request.json();
    await dbConnect();
    
    const todo = await Todo.create({
      title,
      description,
      tags: tags || []
    });

    return NextResponse.json(
      { message: "Todo added", todo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to add todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: any) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    await dbConnect();
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Todo deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: any) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const { title, description, tags, completed } = await request.json();
    await dbConnect();

    const updateData: any = {};
    
    // Only include fields that are provided in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Todo updated", todo: updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}