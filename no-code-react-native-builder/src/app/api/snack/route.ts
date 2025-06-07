import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'snacks.json');

interface SnackData {
  [key: string]: string; // id: code
}

async function readData(): Promise<SnackData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent || '{}') as SnackData;
  } catch (error) {
    // If file doesn't exist or is empty/corrupted, return empty object
    return {};
  }
}

async function writeData(data: SnackData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const id = uuidv4().slice(0, 8); // Generate a short unique ID
    const snacks = await readData();
    snacks[id] = code as string; // Ensure code is treated as string
    await writeData(snacks);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Failed to save snack:', error);
    return NextResponse.json({ error: 'Failed to save snack' }, { status: 500 });
  }
}
