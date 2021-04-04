const express = require('express');
const router = express.Router();

router.use("/admin",require(__dirname+"/admin"));
router.use("/blog",require(__dirname+"/blog"));

router.get("/",(req,res) => {
    // res.send({message:"This is home page"});
    res.redirect("/blog");
});

module.exports = router;