const express = require('express'),
mongoose      = require('mongoose'),
bodyParser    = require('body-parser'),
methodOverride = require('method-override')
app           = express();

mongoose.connect('mongodb://localhost/restful_blog_app');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('Database listening')
})


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));



const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

let Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: 'New article',
//     image: 'https://unsplash.com/photos/tuh3mBbkPb0',
//     body: 'lorem ipsum'
// })


app.get('/', (req, res)=>{   
    res.redirect('blogs')
})

app.get('/blogs', (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index', {blogs: blogs})
        }
    })
   
});

app.get('/blogs/new', (req, res)=>{
    res.render('new')
})

app.post('/blogs', (req, res)=>{
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err) res.render('new');
        res.redirect('/blogs')
    })
})

app.get('/blogs/:id', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err) {
            res.redirect('/blogs')
        }else{
            res.render('show', {blog: foundBlog})
        }
    })
})

app.get('/blogs/:id/edit', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs')
        }else{
            res.render('edit', {blog: foundBlog})
        }
    })
})
app.put('/blogs/:id', (req, res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.delete('/blogs/:id', (req, res) =>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs')
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})