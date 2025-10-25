import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  jobTitle: string;
  jobDescription: string;
  analysisData: {
    atsScore: number;
    summary: string;
    strengths: string[];
    improvementAreas: string[];
    keywordMatch: {
      matched: string[];
      missing: string[];
    };
    recommendations: string[];
    detailedAnalysis: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string;
      github: string;
      website: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    analysisData: {
      atsScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      summary: {
        type: String,
        required: true,
      },
      strengths: [
        {
          type: String,
        },
      ],
      improvementAreas: [
        {
          type: String,
        },
      ],
      keywordMatch: {
        matched: [
          {
            type: String,
          },
        ],
        missing: [
          {
            type: String,
          },
        ],
      },
      recommendations: [
        {
          type: String,
        },
      ],
      detailedAnalysis: {
        type: String,
        required: true,
      },
      contactInfo: {
        name: {
          type: String,
          default: "",
        },
        email: {
          type: String,
          default: "",
        },
        phone: {
          type: String,
          default: "",
        },
        location: {
          type: String,
          default: "",
        },
        linkedin: {
          type: String,
          default: "",
        },
        github: {
          type: String,
          default: "",
        },
        website: {
          type: String,
          default: "",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resume ||
  mongoose.model<IResume>("Resume", ResumeSchema);
