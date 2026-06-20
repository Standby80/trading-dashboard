import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'downloads', 'MetaMetricsSync.ex4');
        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename="MetaMetricsSync.ex4"',
            },
        });
    } catch (error) {
        console.error('Error downloading .ex4 file:', error);
        return NextResponse.json({ error: 'Kunde inte ladda ner filen. EA:n saknas på servern.' }, { status: 500 });
    }
}
