import { User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string; 
    [key: string]: any;
}

// Upload an image
export async function POST(request: NextRequest) {
    // Fetch session
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if (!session || !_user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate userId
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Uploading the file to Cloudinary
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "next-cloudinary-uploads" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json(
            { publicId: result.public_id, userId: userId.toString() }, // Returning userId as well
            { status: 200 }
        );
    } catch (error) {
        console.error("Upload image failed:", error);
        return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
    }
}
