import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const src = path.join(process.cwd(), 'uploads', 'firs');
        const dest = path.join(process.cwd(), 'public', 'uploads', 'firs');

        let logs = [];
        logs.push(`Src: ${src}`);
        logs.push(`Dest: ${dest}`);

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
            logs.push('Created dest dir');
        }

        if (fs.existsSync(src)) {
            const files = fs.readdirSync(src);
            files.forEach(file => {
                const s = path.join(src, file);
                const d = path.join(dest, file);
                if (fs.statSync(s).isFile()) {
                    fs.copyFileSync(s, d);
                    logs.push(`Copied ${file}`);
                }
            });
        } else {
            logs.push('Src does not exist');
        }

        return NextResponse.json({ success: true, logs });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
