import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "guest"],
    default: "user",
  },
  passwordModifiedAt: {
    type: Date,
  },
  registeredAt: { 
  type: Date, 
  default: Date.now() 
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordModifiedAt = Date.now();
  next();
});

// method to compare plain password with hash value
userSchema.methods.comparePass = async function(plainPassword){
  return await bcrypt.compare(plainPassword, this.password)
}

const User = model("User", userSchema);

export default User