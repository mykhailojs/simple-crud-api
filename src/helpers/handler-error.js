class MyError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

function handlerError(res, err) {
    if (err instanceof MyError) {
        res.writeHead(err.statusCode , {'Content-Type': 'text/plain'})
        res.end(err.message)
    } else  {
        console.log(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server error');
    }
}
export {handlerError, MyError};
