import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema,
} from "mongoose";
import { IUser } from "../interface/IUser";
import { validateEmail } from "../helpers/validators";
import { hashPassword } from "../helpers/bcrypt";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    age: Number,
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
  },
  {
    timestamps: true,
  }
);

const preSave = async (next: CallbackWithoutResultAndOptionalError) => {
  const user = this! as IUser;
  if (!user.isModified("password")) return next();

  const hashedPassword = await hashPassword(user.password);
  if (hashedPassword) {
    user.password = hashedPassword;
  }

  throw new Error("Error hashing the password");
};

userSchema.pre<IUser>("save", preSave.bind(userSchema));

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
