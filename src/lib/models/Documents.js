import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
    caseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Case",
        required:true,
    },
    type:{
        type:String,
        default:"FIR",
    },
    fileName: String,
  filePath: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
