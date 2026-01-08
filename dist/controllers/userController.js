import { UserService } from "../services/userService.js";
import { signToken } from "../utils/jwt.js";
import { ResponseHandler } from "../utils/responseHandler.js";
export class UserController {
    constructor() {
        this.register = async (req, res, next) => {
            const user = await UserService.registerUser(req.body);
            const token = signToken({ id: user.id, email: user.email });
            return ResponseHandler.success(res, {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            }, "User created successfully", 201);
        };
        this.login = async (req, res, next) => {
            const user = await UserService.loginUser(req.body);
            const token = signToken({ id: user.id, email: user.email });
            return ResponseHandler.success(res, {
                token
            }, "Login successful", 200);
        };
    }
}
