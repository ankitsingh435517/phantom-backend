import UserModel from "../models/User.model";
import type { UserPayload } from "../types/service.types";

class UserService {
  async exists(username: string) {
    return UserModel.exists({
      username,
    });
  }

  async create(user: UserPayload) {
    return UserModel.create(user);
  }
}

export default UserService;
