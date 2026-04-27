import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IKundali extends Document {
  userId: mongoose.Types.ObjectId
  personalInfo: {
    fullName: string
    gender: string
    dateOfBirth: {
      adYear: number
      adMonth: number
      adDay: number
      bsYear?: number
      bsMonth?: number
      bsDay?: number
      calendarType: 'AD' | 'BS'
    }
    timeOfBirth: {
      hour: number
      minute: number
    }
    birthPlace: {
      country: 'Nepal' | 'India'
      province?: string
      district?: string
      state?: string
      latitude: number
      longitude: number
      altitude: number
    }
  }
  chartData: {
    lagna: string
    lagnaSign: number
    rashi: string
    rashiSign: number
    nakshatra: string
    nakshatraPada: number
    yoga: string
    karana: string
    D1: object
    D9: object
    D10: object
    D12: object
    panchangam: object
    dasha: object
    birthDetails: object
  }
  aiInterpretation: string
  createdAt: Date
}

const KundaliSchema = new Schema<IKundali>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    personalInfo: {
      fullName: { type: String, required: true, trim: true },
      gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
      dateOfBirth: {
        adYear: { type: Number, required: true },
        adMonth: { type: Number, required: true },
        adDay: { type: Number, required: true },
        bsYear: Number,
        bsMonth: Number,
        bsDay: Number,
        calendarType: { type: String, enum: ['AD', 'BS'], default: 'AD' },
      },
      timeOfBirth: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true },
      },
      birthPlace: {
        country: { type: String, required: true, enum: ['Nepal', 'India'] },
        province: String,
        district: String,
        state: String,
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        altitude: { type: Number, default: 0 },
      },
    },
    chartData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    aiInterpretation: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

KundaliSchema.index({ userId: 1, createdAt: -1 })

const Kundali: Model<IKundali> =
  mongoose.models.Kundali || mongoose.model<IKundali>('Kundali', KundaliSchema)

export default Kundali
