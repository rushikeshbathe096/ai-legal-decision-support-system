import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
    firNumber:{
        type:String,
        required:true,
    },
    policeStation:{
        type:String,
        required:true
    },
    firDate:{
        type:Date,
        required:true
    },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
    documents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Document",
        }
    ],
    stage: { 
        type: String, 
        default: "Pre-Trial"
     },
     caseCode: {
  type: String,
  unique: true
},
  createdAt: { 
    type: Date, default: Date.now 
    },
});
export default mongoose.models.Case || mongoose.model("Case", CaseSchema)
