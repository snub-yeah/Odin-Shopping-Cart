import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    // get the path to the json file
    const jsonDirectory = path.join(process.cwd(), 'src/app/api/items');
    // read the json file
    const fileContents = await fs.readFile(jsonDirectory + '/items.json', 'utf8');
    // parse the json
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
} 