

const MESSAGE_TYPE = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
}



exports.createMessage = (
    text,
    code,
    type
) => {
    if (!text) {
        text = 'Unknown error';
    }
    if (!code) {
        code = -1;
    }
    if (!type) {
        type = MESSAGE_TYPE.ERROR;
    }
    return {
        message: text,
        code: code,
        type: type
    }
}

exports.poolExceptionToMessage = (err) => {
    let message = this.createMessage("Database Error", 500, MESSAGE_TYPE.ERROR);
    message.err = err
    return message
}