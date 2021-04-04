const db = require("../common/database");

const conn = db.getConnection();

const getAllPost = () => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM posts", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM posts WHERE?", { id }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const addPost = (params) => {
  if (params) {
    return new Promise((resolve, reject) => {
      conn.query("INSERT INTO posts SET ?", params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  return false;
};

const updatePost = (params) => {
  if (params) {
    return new Promise((resolve, reject) => {
      conn.query(
        "UPDATE posts SET title = ?, content = ?, author = ?, update_at = ? WHERE id = ? ",
        [params.title, params.content,params.author,new Date() ,params.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
  return false;
};

const deletePost = (id) => {
    if (id) {
        return new Promise((resolve, reject) => {
          conn.query(
            "DELETE FROM posts WHERE id = ? ",
            [id],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      }
      return false;
}
module.exports = { getAllPost, addPost, getPostById, updatePost , deletePost };
