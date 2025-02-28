import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } } 
) {
  try {
    const { messageid } = params; 

    if (!messageid) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    // Connect to your database (MongoDB)
    // Example: const result = await db.collection("messages").deleteOne({ _id: new ObjectId(messageid) });

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
