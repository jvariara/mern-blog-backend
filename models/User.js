import { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  // this means we are mentioning the instance of user
  if (this.isModified("password")) {
    // hash password with salt of 10
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

// method to send token as response to use for fetching data
UserSchema.methods.generateJWT = async function () {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Method to compare password with salted password in DB
UserSchema.methods.comparePassword = async function (password) {
  // this is the instance of user we are mentioning, so we can check that password
  return await compare(password, this.password);
};

const User = model("User", UserSchema);
export default User;
