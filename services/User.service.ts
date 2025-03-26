import UserModel from "../models/User.model";


class UserService {
  async exists(username: string) {
    return UserModel.exists({
      username,
    });
  }
}

export default UserService;
