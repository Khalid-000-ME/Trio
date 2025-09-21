import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.wav`;
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(publicDir, filename);

    // Ensure uploads directory exists
    await writeFile(filepath, buffer);

    // Return success response with file details
    return NextResponse.json({
      success: true,
      filename,
      path: `/uploads/${filename}`
    });

  } catch (error) {
    console.error('Error storing audio:', error);
    return NextResponse.json(
      { error: 'Failed to store audio file' },
      { status: 500 }
    );
  }
}