import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.oig9j.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

async function fixPaths() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected");

    const db = mongoose.connection.db;

    // Find all documents
    const docs = await db.collection("documents").find({}).toArray();
    console.log(`Found ${docs.length} documents.`);

    let updated = 0;
    for (const doc of docs) {
        if (doc.filePath && !doc.filePath.startsWith('/uploads')) {
            let newPath = doc.filePath;
            if (newPath.startsWith('uploads/')) {
                newPath = '/' + newPath;
            } else if (newPath.includes('/public/uploads/')) {
                newPath = newPath.split('/public')[1];
            }

            if (newPath !== doc.filePath) {
                await db.collection("documents").updateOne({ _id: doc._id }, { $set: { filePath: newPath } });
                updated++;
            }
        }
    }

    console.log(`Updated ${updated} documents.`);
    process.exit(0);
}

fixPaths().catch(console.error);
