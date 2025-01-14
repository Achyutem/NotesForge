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

