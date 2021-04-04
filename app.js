const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const session = require("express-session");
// const multer = require("multer");

const app = express();
app.use(express.json());
// lấy thông tin từ form par lên
app.use(express.urlencoded({ extended: true }));
// setup express-session
app.set("trust proxy", 1);
app.use(
  session({
    secret: config.get("secret_key"),
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// upload file
// const upload = multer({
  // custom lưu file
//   storage: multer.diskStorage({
//     destination: "public/img",
//     filename(req, file, done) {
//       // custom thay đổi tên
//       console.log(file);
//       const name = Date.now() + "-" + file.originalname;
//       done(null, name);
//     },
//   }),
// });
// setup template engine cho ejs
// set thư mục chứa view
// trong đó "views" là tên file , __dirname+"/app/views" là đường dẫn tới file "views"
app.set("views", __dirname + "/app/views");
app.set("view engine", "ejs");

// cấu hình static folder public cho các file js , css, img của trang web
app.use("/static", express.static(__dirname + "/public"));

const controlers = require(__dirname + "/app/controllers");

app.use(controlers);
// upload hinh cho bài post
// app.post("/upload", upload.single("upload"), (req, res) => {
//   let html;
//   let fs = require("fs");
//   fs.readFile(req.file.path, (err, data) => {
//     if (err) {
//       res.send({ error: err });
//     } else {
//       html = "";
//       html += "<script type='text/javascript'>";
//       html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
//       html += '    var url     = "/static/img/' + req.file.filename + '";';
//       html += '    var message = "Uploaded file successfully";';
//       html += "";
//       html +=
//         "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
//       html += "</script>";

//       res.send(html);
//     }
//   });
// });

const host = config.get("server.host");
const port = config.get("server.port");
app.listen(port, () => {
  console.log("server is running on port", port);
});

