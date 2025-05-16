class customError extends Error {

    constructor(statusCode, message){
        super(message)  // sending message to the parent class. It will set the message property of the parent class and we can access it using this.message.  
        this.statusCode = statusCode;
    }
}

export default customError; 