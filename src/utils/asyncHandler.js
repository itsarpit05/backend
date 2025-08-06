const asyncHandler=(requestHandler)=>{

 // It returns a new function that Express can use as a route handler
  return (req,res,next)=>{
       // We call the original async function (requestHandler)
        // If it returns a promise that gets rejected (i.e., throws an error),
        // Promise.resolve(...).catch(...) will catch that error
    Promise.resolve(requestHandler(req,res,next))
    .catch((err)=>{
  // If there's any error, we pass it to the next() function
                // This sends the error to Express's built-in error handling middleware
      next(err);
    });
  }
}

export {asyncHandler}