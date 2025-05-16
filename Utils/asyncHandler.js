const asyncHandler = (fun) => {         // It will take out controller functions

    return async(req,res,next)=>{       
        // return is needed here so that this we can send this async function code definition in 2nd parameter of Routes.get('/<api-url>', <async-function-code>)
        // async function is created because we want to use next() to send our error using next() to our custom middleware which is handling the errors.
        // Actually this is not a normal async function. If we carefully see, it is a middleware whose syntax is: async(req,res,next) =>{ }

        try{
            await fun(req,res);         
            // await was not required actually, as we have used await wherever needed in "fun" function (i.e. controller function)
            // Still we used await for extra precaution/safety.
            // Try block us used because whenver our "fun" function (i.e. controller function)  runs, it will throw some error whoch will ne sent to catch block below.
        }
        catch(err){
            next(err);  // catch block will send the error to error handling controller  using next().
        }
    };
};

// Why all of this is required?
// It was required to avoid using try and catch blocks in all of our controller functions as this try and catch will now be handled here in asyncHandler(). 

export default asyncHandler;