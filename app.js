//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _ =require("lodash");

const homeStartingContent = "I don't consider myself a writer by any means...in fact I don't even really like blogging...but you see, my dilemma is that I've got things to say and in this day and age when you have something to say, you blog! So here it is.";
const aboutContent = "Blogging allows you to share information about your business and its services but it also allows you to share opinions and thoughts on certain topics.  Blogging is a great way to create a personality for your company and makes your business more credible approachable. So, don’t be afraid to share your interests on your blogs, comment on timely news topics or market trends or educate your readers on a particular topic. Always be sure you write blogs with your audience in mind.";
const contactContent = "You met me at a very strange time in my life";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/postDB",{useNewUrlParser:true});
const postSchema={
  title:String,
  content:String
};
const Post =mongoose.model("Post",postSchema);
app.get("/",function(req,res){
  Post.find(function(err,posts){
    res.render("home",{
      starting:homeStartingContent,
      posts:posts
    });
  });
  
});
app.get("/compose",function(req,res){
  res.render("compose");
  });
  app.post("/compose",function(req,res){
    const post= new Post({
      title:req.body.postTitle,
      content:req.body.postBody
    });
    
    post.save(function(err){
      if(!err){
       res.redirect("/");
      }
    });
   
  });
  app.get("/posts/:postId",function(req,res){
    const requestedPostId=req.params.postId;
    Post.findOne({_id:requestedPostId},function(err,post){
      res.render("post",{
        title:post.title,
        content:post.content
    });
  });
});
app.get("/about",function(req,res){
  res.render("about",{summary:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{contact:contactContent});
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
