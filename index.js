import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

let post1 = [
  { title: 'Welcome to Inner Echoes', content: 'This is the content of the first post.'}
];

let posts = [
  { id: 1 ,title: 'Welcome to Inner Echoes', 
  content: 'This is the content of the first post.' },
  { id: 2 ,title: 'Welcome to Inner Echoes', 
  content: 'This is the content of the second post.' }

];

const truncateContent = (content, maxlength) => {
  if (content.length > maxlength) {
      return content.substring(0, maxlength) + '...';
  }
  return content;
};

app.get("/", (req, res) => {
    res.render("index.ejs", {post1:post1});
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  const newPost = {
    id: posts.length ? posts[posts.length -1].id + 1 : 1,
    title : req.body.title,
    content : req.body.content
  };
  posts.push(newPost);
  res.redirect("/myblog");

});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.render("edit.ejs",{post});  
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    posts[postIndex]= {
      id: postId,
      title: req.body.title,
      content: req.body.content
    };
    res.redirect("/myblog")
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  posts = posts.filter(p => p.id !== postId);
  res.redirect("/myblog")
});


app.get("/myBlog", (req, res) => {
  const reversedOrderPosts = [...posts].reverse();
  const truncatedPosts = reversedOrderPosts.map( post => {
    const truncatedContent = truncateContent(post.content, 100);
    return {...post, content: truncatedContent};
  })
  res.render("starter.ejs", {posts: truncatedPosts})

})

app.get("/myBlog/:id", (req, res) => {
  const postId = parseInt (req.params.id);
  const post = posts.find(p => p.id === postId);
  if (post) {
    // post.content = post.content.replace(/\n/g, `<br>`);
    res.render("post.ejs",{post});  
  } else {
    res.status(404).send("Post not found");
  }

})

app.get("/about", (req, res) => {
  res.render("about.ejs");
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


