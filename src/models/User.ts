import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema,
} from "mongoose";
import { IUser } from "../interface/IUser";
import { validateEmail } from "../helpers/validators";
import { hashPassword } from "../helpers/bcrypt";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    age: Number,
    refreshToken: String,
    verificationToken: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value: string) => validateEmail(value),
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: (value: string) => !!value,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

async function preSave(next: CallbackWithoutResultAndOptionalError) {
  // @ts-ignore
  const user = this as IUser;

  // ** Default the value of email verified to false when first register
  // user.emailVerified = false;

  if (!user.isModified("password")) return next();

  const hashedPassword = await hashPassword(user.password);
  if (hashedPassword) {
    user.password = hashedPassword;
    return next();
  }

  throw new Error("Error hashing the password");
}

userSchema.pre<IUser>("save", preSave);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
