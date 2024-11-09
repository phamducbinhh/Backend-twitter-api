const HttpStatusCode = {
  SUCCESS: 200, //Dữ liệu hợp lệ và được trả về thành công.
  CREATED: 201, //Dữ liệu mới đã được tạo thành công.
  BAD_REQUEST: 400, //Dữ liệu gửi lên không hợp lệ hoặc thiếu thông tin cần thiết.
  UNAUTHORIZED: 401, //Người dùng chưa được xác thực.
  FORBIDEN: 403, //Người dùng không có quyền truy cập vào tài nguyên yêu cầu.
  NOT_FOUND: 404, //Tài nguyên không được tìm thấy.
  UNPROCESSABLE_ENDTITY: 422, //Dữ liệu gửi lên không hợp lệ, nhưng không thuộc về lỗi 400 Bad Request.
  INTERNAL_SERVER_ERROR: 500, //Lỗi server.
  CONFLICT: 409 //Tài nguyên đã tồn tại.
}

module.exports = HttpStatusCode
