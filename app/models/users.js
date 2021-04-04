const db = require("../common/database");

const conn = db.getConnection();

const selectAllUser = () =>{
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM blog.users",(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
};


const addUser = (user) => {
    if(user){
        return new Promise ((resolve, reject) =>{
            conn.query("INSERT INTO users SET ?",user,(err,result) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        })
    }
    return false;
};

const getUserByEmail = (email) => {
    if(email) {
        return new Promise((resolve,reject)=> {
            conn.query("SELECT * FROM users WHERE ?",{email:email},(err,result) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        })
    }
    return false;
};

const getAllUser  = () => {
    return new Promise((resolve,reject) => {
        conn.query("SELECT * FROM users" , (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result)
            }
        })
    })
};

module.exports = {addUser, selectAllUser ,getUserByEmail ,getAllUser};