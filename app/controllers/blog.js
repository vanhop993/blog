const express = require('express');
const router = express.Router();

const post_md = require("../models/post");

router.get("/",(req,res) => {
    // res.send({message:"This is Blog Page"});
        post_md.getAllPost().then((result) => {
            const data = {
                posts:result,
                error:false,
            };
            res.render("blog/index",{data});
        }).catch(err => {
            const data = {
                error:"Could not get post data",
            };
            res.render("blog/index",{data});
        })
});

router.get("/post/:id", (req,res) => {
    post_md.getPostById(req.params.id).then((result) => {
        const data = {
            post:result[0],
            err:false
        }
        res.render("blog/post",{data});
    }).catch((err) => {
        const data = {
            err:"Could not get post detail",
        }
        res.render("blog/post",{data});
    })
});

router.get("/about",(req,res) => {
    res.render("blog/about");
})

module.exports = router;