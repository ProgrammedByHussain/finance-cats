import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create a unique filename
    const timestamp = new Date().getTime();
    const filename = `upload_${timestamp}.csv`;
    const filePath = path.join(process.cwd(), 'src', 'csvstoragefile', filename);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write file to storage
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully',
      filename: filename 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
} 