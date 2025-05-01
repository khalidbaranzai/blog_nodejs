const express = require('express');
const app = express();
const port = 3000;


// MIDDLE WARES
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// IN MEMORY POST ARRAY
let posts = [];

// HOME ROUTE
app.get('/', (req, res) =>{
    res.render('home', {posts});
})

app.get('/compose', (req, res)=>{
    res.render('compose');
});

// HANDLE FORM SUBMISSION
app.post('/compose', (req, res)=>{
    const {title, content} = req.body;
    const newPost= {
        id: Date.now(),
        title, 
        content
    };
    posts.push(newPost);
    res.redirect('/');
});


// VIEW A SINGLE POST BY ID
app.get('/posts/:id', (req, res) =>{
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    if (post) {
        res.render("post", {post});
    } else {
        res.status(404).send("Post not found");
    }
});


// GET EDIT PAGE
app.get('/posts/:id/edit', (req, res) =>{
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);
    if(post){
        res.render('edit', {post});
    } else {
        res.status(404).send("Post not found");
    }
});

// POST updated post
app.post('/posts/:id/edit', (req, res) => {
    const postId = Number(req.params.id);
    const {title, content} = req.body;

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.title = title;
        post.content = content;
        res.redirect(`/posts/${postId}`);        
    } else {
        res.status(404).send("Post not found");
    }
});


app.post('/posts/:id/delete', (req, res)=>{
    const postId = Number(req.params.id);
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
        res.redirect('/');
    } else {
        res.status(404).send("Post not found");
    }
});











// SERVER START
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});

