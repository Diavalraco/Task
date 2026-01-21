import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, Role } from '../types';

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.EMPLOYEE
    },
    department: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    const obj = ret as { password?: string };
    delete obj.password;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
