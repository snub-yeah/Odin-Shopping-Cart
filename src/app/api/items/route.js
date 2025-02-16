import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // get the path to the json file
    const jsonDirectory = path.join(process.cwd(), 'src/app/api/items');
    // read the json file
    const fileContents = await fs.readFile(jsonDirectory + '/items.json', 'utf8');
    // parse the json
    const data = JSON.parse(fileContents);

    if (id) {
        const item = data.items.find(item => item.id == id);
        if (!item) {
            return NextResponse.json({ error: 'Item not found' });
        }
        return NextResponse.json(item);
    }

    return NextResponse.json(data);
} 