let parse = () => {
    let env = process.env.SAUCE_ENV;
    let creds = require('../../' + env + '.json');
    return creds;
};

export {parse};
