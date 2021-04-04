const express = require("express");
const router = express.Router();
const multer = require("multer");

const helper = require("../helpers/helpers");
const user_md = require("../models/users");
const post_md = require("../models/post");

const upload = multer({
  // custom lưu file
  storage: multer.diskStorage({
    destination: "public/img",
    filename(req, file, done) {
      // custom thay đổi tên
      const name = Date.now() + "-" + file.originalname;
      done(null, name);
    },
  }),
});

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect("/admin/signin");
      return;
    }
    const data = await post_md.getAllPost();
    res.render("admin/dashboard", { data });
  } catch (err) {
    res.render("admin/dashboard", { data: { err: "Get post data is Error" } });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup", { data: {} });
});

router.post("/signup", async (req, res) => {
  const user = req.body;
  if (user.email.trim().length === 0) {
    res.render("signup", { data: { err: "Email is required" } });
  }
  //user.emai user.passwd vs user.repasswd là attribute name cua input
  if (user.passwd.trim().length === 0) {
    res.render("signup", { data: { err: "Password is required" } });
  }
  if (user.repasswd.trim().length === 0) {
    res.render("signup", { data: { err: "Re-Password is required" } });
  }

  if (user.passwd != user.repasswd) {
    res.render("signup", { data: { err: "Password is not match" } });
  }
  const arrayUser = await user_md.selectAllUser();
  arrayUser.forEach((userItem) => {
    if (user.email === userItem.email)
      return res.status(401).send({ message: "User is exist!!" });
  });
  // insert to DB

  const password = helper.hash_password(user.passwd);
  let newUser = {
    email: user.email,
    password: password,
    first_name: user.firstname,
    last_name: user.lastname,
  };
  const result = user_md.addUser(newUser);
  result
    .then(() => {
      res.redirect("/admin/signin");
    })
    .catch((err) => {
      console.log(err);
      res.render("signup", { data: { err: "error" } });
    });
});

router.get("/signin", (req, res) => {
  res.render("signin", { data: {} });
});

router.post("/signin", (req, res) => {
  const params = req.body;
  if (params.email.trim().length == 0) {
    res.render("signin", { data: { err: "Please enter an email" } });
  }
  const data = user_md.getUserByEmail(params.email);
  if (data.length !== 0) {
    data
      .then((users) => {
        let user = users[0];
        let status = helper.compare_password(params.password, user.password);
        if (!status) {
          res.render("signin", { data: { err: "Password wrong" } });
        }
        req.session.user = user;
        res.redirect("/admin/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("signin", { data: { err: "User not exist" } });
  }
});

router.get("/post", (req, res) => {
  if (req.session.user) {
    res.redirect("/admin");
  } else {
    res.redirect("/admin/signin");
  }
});

router.get("/post/new", (req, res) => {
  if (req.session.user) {
    res.render("admin/post/new", { data: { err: false } });
  } else {
    res.redirect("/admin/signin");
  }
});

router.post("/post/upload", upload.single("upload"), (req, res) => {
  if (req.session.user) {
    let html;
    let fs = require("fs");
    fs.readFile(req.file.path, (err, data) => {
      if (err) {
        res.send({ error: err });
      } else {
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += '    var url     = "/static/img/' + req.file.filename + '";';
        html += '    var message = "Uploaded file successfully";';
        html += "";
        html +=
          "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";

        res.send(html);
      }
    });
  } else {
    res.redirect("/admin/signin");
  }
});

router.post("/post/new/add", (req, res) => {
  if (req.session.user) {
    const params = req.body;
    const now = new Date();
    params.create_at = now;
    params.update_at = now;
    if (params.title.trim().length === 0) {
      const data = {
        err: "Please enter a title",
      };
      res.render("admin/post/new", { data: data });
      return;
    }
    if (params.content.trim().length === 0) {
      const data = {
        err: "Please enter content",
      };
      res.render("admin/post/new", { data: data });
      return;
    }
    if (params.author.trim().length === 0) {
      const data = {
        err: "Please enter author",
      };
      res.render("admin/post/new", { data: data });
      return;
    }
    const data = post_md.addPost(params);
    data
      .then(() => {
        res.redirect("/admin");
      })
      .catch(() => {
        const data = {
          err: "Coust not insert post",
        };
        res.render("admin/post/new", { data: data });
      });
  } else {
    res.redirect("/admin/signin");
  }
});

router.get("/post/edit/:id", (req, res) => {
  if (req.session.user) {
    const { id } = req.params;
    post_md
      .getPostById(id)
      .then((result) => {
        if (result.length === 0) {
          const data = {
            error: "Could not get Post by Id",
          };
          res.render("admin/post/edit", { data });
          return;
        }
        const post = result[0];
        const data = {
          post,
          error: false,
        };
        res.render("admin/post/edit", { data });
      })
      .catch((err) => {
        console.log(err);
        const data = {
          error: "Could not get Post by Id",
        };
        res.render("admin/post/edit", { data });
      });
  } else {
    res.redirect("/admin/signin");
  }
});

router.put("/post/edit", (req, res) => {
  if (req.session.user) {
    const params = req.body;
    post_md
      .updatePost(params)
      .then(() => {
        res.status(200).send({ message: "update success!!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "something went wrong!!" });
      });
  } else {
    res.redirect("/admin/signin");
  }
});

router.delete("/post/delete", (req, res) => {
  if (req.session.user) {
    const { id } = req.body;
    post_md
      .deletePost(id)
      .then(() => {
        res.status(200).send({ message: "Delete success" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Something went wrong" });
      });
  } else {
    res.redirect("/admin/signin");
  }
});

router.get("/user", (req, res) => {
    if(req.session.user){
  user_md
    .getAllUser()
    .then((result) => {
      const data = {
        users: result,
        error: false,
      };
      res.render("admin/user", { data });
    })
    .catch((err) => {
      const data = {
        error: "Could not get user infor",
      };
      res.render("admin/user", { data });
    });
}else{
    res.redirect("/admin/signin")
}
});

module.exports = router;
