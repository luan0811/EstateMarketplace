// Import các module cần thiết
import User from "../models/user.model.js"; // Model User
import bcryptjs from "bcryptjs"; // Thư viện để mã hóa mật khẩu
import { errorHandler } from "../../utils/error.js"; // Hàm xử lý lỗi
import jwt from "jsonwebtoken"; // Thư viện để tạo và xác thực JSON Web Tokens

// Hàm đăng ký người dùng
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // Lấy thông tin từ request body
  const hashedPassword = bcryptjs.hashSync(password, 10); // Mã hóa mật khẩu
  const newUser = new User({ username, email, password: hashedPassword }); // Tạo người dùng mới với mật khẩu đã mã hóa

  try {
    await newUser.save(); // Lưu người dùng mới vào database
    res.status(201).json("User created successfully!"); // Trả về thông báo thành công
  } catch (error) {
    next(errorHandler(550, "Username or email already taken")); // Nếu có lỗi, gọi hàm xử lý lỗi
  }
};

// Hàm đăng nhập
export const signin = async (req, res, next) => {
  const { email, password } = req.body; // Lấy email và mật khẩu từ request body

  try {
    const validUser = await User.findOne({ email }); // Tìm người dùng với email tương ứng
    if (!validUser)
      return next(
        errorHandler(404, "Invalid password or email, please check again")
      ); // Nếu không tìm thấy người dùng, trả về lỗi

    const validPassword = bcryptjs.compareSync(password, validUser.password); // So sánh mật khẩu nhập vào với mật khẩu trong database
    if (!validPassword)
      return next(
        errorHandler(401, "Invalid password or email, please check again")
      ); // Nếu mật khẩu không khớp, trả về lỗi

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // Tạo token cho người dùng
    const { password: pass, ...rest } = validUser._doc; // Loại bỏ mật khẩu khỏi thông tin người dùng
    res
      .cookie("access_token", token, {
        httpOnly: true,
      }) // Gửi token dưới dạng cookie
      .status(200)
      .json(rest); // Trả về thông tin người dùng
  } catch (error) {
    next(error); // Nếu có lỗi, chuyển lỗi đến middleware xử lý lỗi tiếp theo
  }
};