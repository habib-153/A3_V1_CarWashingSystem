import { Schema, model } from 'mongoose';
import { TService } from './service.interface';

const serviceSchema = new Schema<TService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

serviceSchema.pre('find', function(){
    this.find({ isDeleted: {$ne: true}})
})

serviceSchema.pre('findOne', function(){
    this.find({ isDeleted: {$ne: true}})
})

export const Service = model<TService>('Service', serviceSchema);
