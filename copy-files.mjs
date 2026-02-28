import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'uploads', 'firs');
const targetDir = path.join(process.cwd(), 'public', 'uploads', 'firs');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    let copied = 0;
    for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, targetPath);
            copied++;
        }
    }
    console.log(`Copied ${copied} files to public/uploads/firs.`);
} else {
    console.log('Source directory does not exist.');
}
