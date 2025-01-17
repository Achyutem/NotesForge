import { NextResponse } from 'next/server';
import dbConnect from "@/app/lib/dbConnect";
import Todo from "@/app/(models)/todos";

export async function GET() {
    try {
        await dbConnect();

        const existingTodos = await Todo.find();

        return NextResponse.json({ existingTodos });
    } catch (error) {
        console.error("Error fetching todos:", error);

        return NextResponse.json(
            { error: "Failed to fetch todos" },
            { status: 500 }
        );
    }
}

export async function POST(request : any) {
    const {title, description} = await request.json()
    try {
        await dbConnect();

        await Todo.create({title, description})

        return NextResponse.json({ message: "Todo adeed"}, {status : 201});
    } catch (error) {
        console.error("Error fetching todos:", error);

        return NextResponse.json(
            { error: "Failed to add todos" },
            { status: 500 }
        );
    }
}

export async function DELETE(request : any) {
    const id = request.nextUrl.searchParams.get('id')
    try {
        await dbConnect();

        await Todo.findByIdAndDelete(id)

        return NextResponse.json({ message: "Todo deleted"}, {status : 201});
    } catch (error) {
        console.error("Error fetching todos:", error);

        return NextResponse.json(
            { error: "Failed to delete todos" },
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

    const { title, description, completed } = await request.json();

    await dbConnect();

    let updatedTodo;

    if (title !== undefined || description !== undefined) {
      // Edit mode: Update title and/or description
      updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
    } else if (typeof completed === "boolean") {
      // Toggle completed mode: Update completed status
      updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { completed },
        { new: true }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

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
