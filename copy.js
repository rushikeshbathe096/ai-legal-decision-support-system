const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'uploads', 'firs');
const dest = path.join(__dirname, 'public', 'uploads', 'firs');

console.log('Src:', src);
console.log('Dest:', dest);

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log('Created dest dir');
}

if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const s = path.join(src, file);
        const d = path.join(dest, file);
        if (fs.statSync(s).isFile()) {
            fs.copyFileSync(s, d);
            console.log('Copied', file);
        }
    });
} else {
    console.log('Src does not exist');
}
console.log('Done');
