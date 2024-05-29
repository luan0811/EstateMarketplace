// Import các hàm từ thư viện redux toolkit và jsonwebtoken
import { createSlice, current } from "@reduxjs/toolkit";

// Định nghĩa trạng thái ban đầu của user
const initialState = {
  currentUser: null, // Người dùng hiện tại, ban đầu là null
  error: null, // Lỗi, ban đầu là null
  loading: false, // Trạng thái tải, ban đầu là false
};

// Tạo một slice cho user với các reducer tương ứng
const userSlice = createSlice({
    name: "user", // Tên của slice
    initialState, // Trạng thái ban đầu
    reducers: {
        // Reducer bắt đầu đăng nhập
        signInStart: (state) => {
            state.loading = true; // Đặt trạng thái tải thành true
        },
        // Reducer thành công khi đăng nhập
        signInSuccess: (state, action) => {
            state.currentUser = action.payload; // Cập nhật người dùng hiện tại với payload từ action
            state.loading = false; // Đặt trạng thái tải thành false
            state.error = null; // Xóa lỗi
        },
        // Reducer thất bại khi đăng nhập
        signInFail: (state, action) => {
            state.loading = false; // Đặt trạng thái tải thành false
            state.error = action.payload; // Cập nhật lỗi với payload từ action
        },
    },
})

// Xuất các action từ userSlice
export const { signInStart, signInSuccess, signInFail } = userSlice.actions;

export default userSlice.reducer;