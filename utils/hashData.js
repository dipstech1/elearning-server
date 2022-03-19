import bcrypt from 'bcrypt'

export const hashData = (data) => {
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(12,(err,salt) => {
            if(err)
                reject(err);
            bcrypt.hash(data,salt)
                .then((encryptedData => resolve(encryptedData)))
                .catch(errData => reject(errData))
        })
    })
}

export const comparehashData = (data,hashedData) => {
    return bcrypt.compare(data,hashedData);
}