import jwt from "jsonwebtoken";
import { TUserProps } from "../types/TUserProps";
import { IUser } from "../interface/IUser";
import UserModel from "../models/User";

class UserService {
  constructor(
    private _REFRESH_SECRET = process.env.REFRESH_SECRET,
    private JWT_SECRET = process.env.JWT_SECRET
  ) {}

  /**
   * Creates a new user in the database.
   *
   * @param userData - The data for the new user.
   * @returns A Promise that resolves to the created user.
   * @throws {Error} If a user with the same email already exists.
   * @throws {Error} If there is an error saving the user or retrieving the saved user.
   */
  async createUser(
    userData: Partial<TUserProps>,
    refreshToken?: string
  ): Promise<IUser> {
    const _refreshToken =
      refreshToken ??
      jwt.sign({ email: userData.email }, this._REFRESH_SECRET, {
        expiresIn: "7d",
      });

    const user = new UserModel({ ...userData, refreshToken: _refreshToken });
    await user.save();

    const savedUser = await UserModel.findById<IUser>(user._id)
      .select("-password -__v")
      .lean();

    if (!savedUser) {
      throw new Error("Failed to retrieve saved user");
    }

    return savedUser;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select("-password -__v").lean();
  }

  async findUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("-password -__v").lean();
  }

  async findUserByGoogleId(googleId?: string): Promise<IUser | null> {
    return UserModel.findOne({ googleId }).select("-password -__v").lean();
  }

  async updateUser(
    id: string,
    updateData: Partial<TUserProps>
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, updateData, { new: true })
      .select("-password -__v")
      .lean();
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).select("-password -__v").lean();
  }

  createJWT(payload: string | Buffer | object, opts?: jwt.SignOptions) {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "1h",
      ...opts,
    });
  }
}

export default new UserService();
