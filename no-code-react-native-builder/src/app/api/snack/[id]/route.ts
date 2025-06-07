import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'snacks.json');

interface SnackData {
  [key: string]: string;
}

async function readData(): Promise<SnackData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent || '{}') as SnackData;
  } catch (error) {
    return {};
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const snacks = await readData();
    const code = snacks[id];

    if (code) {
      return NextResponse.json({ id, code }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Snack not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to retrieve snack:', error);
    return NextResponse.json({ error: 'Failed to retrieve snack' }, { status: 500 });
  }
}
