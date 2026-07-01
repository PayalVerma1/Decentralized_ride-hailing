import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['passenger', 'driver', 'admin'],
      default: 'passenger',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendReason: {
      type: String,
      default: '',
    },
    walletAddress: {
      type: String,
      default: '',
    },
    emergencyContacts: [
      {
        name: { type: String },
        phone: { type: String },
        relationship: { type: String },
      },
    ],
    savedLocations: [
      {
        name: { type: String }, // e.g. "Home", "Work"
        address: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
      },
    ],
    preferences: {
      notifications: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'ridechain_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}

// Virtual: full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

const User = mongoose.model('User', userSchema)
export default User
