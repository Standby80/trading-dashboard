import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'downloads', 'MetaMetricsSync.mq5');
        let mql5Code = fs.readFileSync(filePath, 'utf8');

        // Ersätt placeholder med riktig server-URL
        const serverUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        mql5Code = mql5Code.replace('PLACEHOLDER_SERVER_URL', serverUrl);

        return new NextResponse(mql5Code, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': 'attachment; filename="MetaMetricsSync.mq5"',
            },
        });
    } catch (error) {
        console.error('Error reading .mq5 file:', error);
        return NextResponse.json({ error: 'Kunde inte ladda ner filen.' }, { status: 500 });
    }
}
