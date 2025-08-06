// Define a class called ApiResponse
// It helps you send a clean, structured success response from your API
class ApiResponse {

  // The constructor runs when you create a new ApiResponse object
  constructor(statusCode, data, message = "Success") {
      
      // Set the HTTP status code, like 200 (OK), 201 (Created), etc.
      this.statusCode = statusCode;

      // Set the actual data you want to return to the frontend (like user info, todo list, etc.)
      this.data = data;

      // Set a message to describe the result (default is "Success")
      this.message = message;

      // Set success to true only if statusCode is less than 400
      // This follows the HTTP rule: 2xx/3xx = success, 4xx/5xx = error
      this.success = statusCode < 400;
  }
}
// Export the ApiResponse class so it can be used in other files
export { ApiResponse };



/*****************************EXAMPLE TO EXPLAIN
 * 
 * 
import { ApiResponse } from './utils/ApiResponse.js';

app.get('/user/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
}));


O/P
{
  "statusCode": 200,
  "data": {
    "_id": "12345",
    "name": "John Doe"
  },
  "message": "User fetched successfully",
  "success": true
}

*/


export {ApiResponse}