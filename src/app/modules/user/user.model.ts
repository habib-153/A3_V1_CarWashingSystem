import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import { Role } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: { values: Role, message: '{VALUE} is not supported' },
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
});

userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    return user;
}

export const User = model<TUser>('User', userSchema)