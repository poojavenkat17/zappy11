const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const crypto = require('crypto'); 

const secretKey = crypto.randomBytes(32).toString('hex');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: secretKey, resave: true, saveUninitialized: true })); 
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
const upload = multer();


mongoose.connect('mongodb+srv://sixSlay:oZ8NGjZswFfgw2wG@serverlessinstance2.yx1strl.mongodb.net/zappy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    console.log(req.session)
    return next();
  } else {

    return res.redirect('/404');

  }
}

const elements=new mongoose.Schema({
name:String,
price:Number,
images: {
  data: Buffer,
  contentType: String
}
 
})

const Product = mongoose.model('elements', elements);
const Marriage = new mongoose.Schema({
    name:String,
    date:String,
  event:String,
  location:String,
  days:Number,
  mahal:String,
  
  images: [
    {
      name: String,
      data: Buffer,
    },
  ],
});

const marriageImage = mongoose.model('marriage', Marriage);



const baby = new mongoose.Schema({
    name:String,
    date:String,
  event:String,
  location:String,
  days:Number,
  mahal:String,
  
  images: [
    {
      name: String,
      data: Buffer,
    },
  ],
});


const babyImage = mongoose.model('baby', baby);

const maternity = new mongoose.Schema({
  name:String,
  date:String,
event:String,
location:String,
days:Number,
mahal:String,

images: [
  {
    name: String,
    data: Buffer,
  },
],
});

const maternityImage = mongoose.model('maternity', maternity);




const loginSchema= new mongoose.Schema({
  Username:{type:String},
  Email:{type:String},
  Password:{type:String},
})
const Login = mongoose.model('login', loginSchema
);

const videoSchema= new mongoose.Schema({
  Video:{type:String}
})
const video = mongoose.model('video', videoSchema
);





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));





























app.get('/imageupload', async(req, res) => {
  const baby = await babyImage.countDocuments({});
  const marriage = await marriageImage.countDocuments({});
const cardTotal=baby+marriage

  res.render('imageadd',{cardTotal});
});
//Const upload = multer();

app.post('/imageupload', upload.array('images'), async (req, res) => {
//app.post('/imageupload', upload.array('images', 15), async (req, res) => {
  try {
    const images = req.files;
    const name=req.body.name;
    const days=req.body.date;
   const event=req.body.event;
   console.log(images.length);
   if (req.files.length > 15) {
    res.redirect('/404');
    return;
     }
   console.log(event)
  if (event=="Wedding"){
    const imageDocument = new marriageImage({
      event:event,
      name:name,
      date:days,
  
   
      
    });
   
    images.forEach((image) => {
      
      imageDocument.images.push({
        name: image.originalname,
        data: image.buffer,
      });
    });

 
    await imageDocument.save();


  }
  if (event=="Baby photography"){
    const imageDocument = new babyImage({
      event:event,
      
      name:name,
      date:days,
  
    
    });
   
    images.forEach((image) => {
      
      imageDocument.images.push({
        name: image.originalname,
        data: image.buffer,
      });
    });

 
    await imageDocument.save();


  }
  if (event=="Maternity photography"){
    const imageDocument = new maternityImage({
      event:event,
      
      name:name,
      date:days,
  
    
    });
   
    images.forEach((image) => {
      
      imageDocument.images.push({
        name: image.originalname,
        data: image.buffer,
      });
    });

 
    await imageDocument.save();


  }
    res.redirect('/successimage');
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});

app.post('/video',async (req, res) =>{
  try{
    const {name}=req.body;
    console.log(name);
    const videoDocument = new video({
      Video:name, 
    });
     await videoDocument.save();
    res.redirect('/successvideo')
  }
  catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});







app.get('/marriage',async (req, res) => {
    try {
   
        const imageDocument = await marriageImage.find();
        console.log(imageDocument)
        
        res.render('moments.ejs', { imageDocument });
      } catch (error) {
        console.error(error);
        res.redirect('/404');
      }
});
app.get('/baby', async (req, res) => {
  try {
   
    const imageDocument = await babyImage.find();
    console.log(imageDocument)
  
    res.render('moments.ejs', { imageDocument });
  } catch (error) {
    console.error(error);
     res.redirect('/404');
  }
});
app.get('/maternity',async (req, res) => {
  try {
 
      const imageDocument = await maternityImage.find();
      console.log(imageDocument)
      
      res.render('moments.ejs', { imageDocument });
    } catch (error) {
      console.error(error);
      res.redirect('/404');
    }
});





app.get('/view/:fileId', async (req, res) => {
  fileId = req.params.fileId;
  console.log(fileId)
  try {
      const item = await babyImage.findOne({_id:fileId}) ||  await marriageImage.findOne({_id:fileId})||await maternityImage.findOne({_id:fileId})
       console.log(item)
      const images=item.images
      console.log(images.length)
      if (!item) {
          return  res.redirect('/404');
      }
   
      await res.render('inside.ejs', {item , images});
      
      
  } catch (error) {
      console.error(error);
      res.redirect('/404');
  }
});



///Login

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', async (req, res) => {
  
  try {
    const textToDisplay = "";
    await res.render('login' ,{textToDisplay});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/login', async (req, res) => {


  try {
    
    const Email = req.body.Email;
    const Password=req.body.Password;
    const use=req.body.userType;
    const secretkey=req.body.secretKey;
    
    const user = await Login.findOne({Email:Email}) ;
    const user_pass = await Login.findOne({Password:Password}) ;
    console.log(user)
    
   
    if (secretkey==="zappy123" && user && user_pass && use==='Admin') {
      req.session.authenticated = true;
       res.redirect('/admin');
      
    } else
    if (user && user_pass && secretkey!=="zappy123" && use==='Admin'){
      const textToDisplay = "SecretKey Entered Wrong";
       await res.render('login', {textToDisplay});
      
      
      
    }else
    if(user && user_pass && use==='User'){
      req.session.authenticated = true;
      res.redirect('/sell');
    }
    else{
      const textToDisplay = "Email or password entered wrong";
      await res.render('login', {textToDisplay});

     
    }
    
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
}
  )

  
    



  
  app.get('/register', async (req, res) => {
  
    try {
      const textToDisplay = "";
     await res.render('reg', {textToDisplay});
    
      
      
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  app.post('/register', async (req, res,next) => {
    try{
   const username=req.body.Username
   const email=req.body.Email
   const password=req.body.Password
  
   const newLogin = new Login({
    Username:username,
    Email:email,
    Password:password
    
  });
  await newLogin.save();
  
  
  // const textToDisplay = "You are registred ";
  await res.render('successcredentials', { textToDisplay: "You are registred " });
  
  
  
  
    }
    catch (error) {
      console.error(error);
      res.redirect('/404');
  }
  });




// delete
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/moments', async(req, res) => {
  const videoDocument = await video.find();
  console.log(videoDocument)
  res.render('main',{videoDocument});
});
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/successimage', (req, res) => {
  res.render('sucessimage');
});
app.get('/successproduct', (req, res) => {
  res.render('sucessproduct');
});

app.get('/inside', (req, res) => {
  res.render('inside');
});
/*
app.get('/404', (req, res) => {
  res.render('404');
});*/
app.use('/404',(req, res) => {
  res.render('404');
});
app.get('/mailsuccess', (req, res) => {
  res.render('mailsuccess');
});
app.get('/video', (req, res) => {
  res.render('videoadd');
});
app.get('/successvideo', (req, res) => {
  res.render('successvideo');
});



app.get('/imagedelete', async(req, res) => {
  const baby = await babyImage.countDocuments({});
  const marriage = await marriageImage.countDocuments({});
  const maternity = await maternityImage.countDocuments({});
const cardTotal=baby+marriage+maternity
 res.render('maindelete',{cardTotal})
});
app.get('/admin', async(req, res) => {
  const totalCount = await Product.countDocuments({});
  const baby = await babyImage.countDocuments({});
  const marriage = await marriageImage.countDocuments({});
  const maternity = await maternityImage.countDocuments({});
const cardTotal=baby+marriage+maternity
const totalLogin=await Login.countDocuments({});
  res.render('admin',{totalCount,cardTotal,totalLogin});
});





app.get('/contactus', (req, res)=>{
  res.render('contactus')})
app.post('/contactus',(req,res)=>{
     console.log(req.body);
     const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'harini200329@gmail.com',
            pass: 'tqdy zfvn xqaf mqfm'
        }
     })
     const mailOptions ={
        from: req.body.email,
        to: 'chinguopso@gmail.com',
        subject: `Message from ${req.body.email}:  ${req.body.subject} `,
        text: req.body.message
     }
     transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            res.redirect('/404');

        }
        else{
            console.log('Email sent: ' + info.response);
            res.send('success')
        }
     })
})







app.get('/marriagedelete',async (req, res) => {
  try {
 
      const imageDocument = await marriageImage.find();
      console.log(imageDocument)
      
      res.render('imagedelete', { imageDocument });
    } catch (error) {
      console.error(error);
       res.redirect('/404');
    }
});
app.get('/babydelete', async (req, res) => {
try {
 
  const imageDocument = await babyImage.find();
  console.log(imageDocument)
  
  res.render('imagedelete', { imageDocument });
} catch (error) {
  console.error(error);
   res.redirect('/404');
}
});
app.get('/maternitydelete', async (req, res) => {
  try {
   
    const imageDocument = await maternityImage.find();
    console.log(imageDocument)
    
    res.render('imagedelete', { imageDocument });
  } catch (error) {
    console.error(error);
     res.redirect('/404');
  }
  });

app.get('/remove_cards/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);

  try {
    if (!fileId) {
      return res.status(404).send('File not found');
    }

    const babyImageDeletion = await babyImage.deleteOne({ _id: fileId });
    const marriageImageDeletion = await marriageImage.deleteOne({ _id: fileId });
    const maternityImageDeletion = await maternityImage.deleteOne({ _id: fileId });
    if (babyImageDeletion.deletedCount > 0) {
     const imageDocument=await babyImage.find()
     res.redirect('/imagedelete')
    } 
    if (maternityImageDeletion.deletedCount > 0) {
      const imageDocument=await maternityImage.find()
      res.redirect('/imagedelete')
     }
    if (marriageImageDeletion.deletedCount > 0) {
      const imageDocument=await marriageImage.find()
      res.redirect('/imagedelete')
     }
    
    
    else {
      return res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});




app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());



app.get('/element_add', async(request, response) => {
  const totalCount = await Product.countDocuments({});
    response.render('productadd',{totalCount});
  });

app.post('/element_add',upload.single('images'),async(request,response)=>{
  const name=request.body.name;
  const price=request.body.price;
  
  try {
    console.log(price,name)

     const newFormData = new Product({
         name:name,
         price:price,
         images: {
          data: request.file.buffer,
          contentType: request.file.mimetype
        }
         
     });
     await newFormData.save();
     response.redirect('/successproduct');
     
 } catch (error) {
     console.error(error);
     response.status(500).send('An error occurred.');
 }
});








app.use(bodyParser.urlencoded({ extended: true }));

// Define a variable to hold the cart data. You can use a database for this in a production environment.
const cart = [];

app.get('/sell', async (req, res) => {
  try {
    // Fetch product data only once when the page is loaded.
    const products = await Product.find();
    res.render('product', { products, cart });
  } catch (err) {
    res.redirect('/404');
  }
});

// Handle adding items to the cart
app.post('/add_cart', (req, res) => {
  const { product_id, product_name, product_price } = req.body;

  // Check if the product is already in the cart
  const existingItem = cart.find(item => item.product_id === product_id);

  if (existingItem) {
    // Increment the quantity if it's already in the cart
    existingItem.quantity++;
  } else {
    // Add the product to the cart
    cart.push({
      product_id,
      name: product_name,
      price: parseFloat(product_price),
      quantity: 1,
    });
  }

  // Respond with JSON data instead of rendering the entire page.
  res.json({ cart });
});

// Handle removing items from the cart
app.get('/remove_items/:productId', (req, res) => {
  const productId = req.params.productId;

  // Find the item in the cart
  const itemIndex = cart.findIndex(item => item.product_id === productId);

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      cart.splice(itemIndex, 1);
    }
  }

  // Respond with JSON data instead of rendering the entire page.
  res.json({ cart });
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('product', { products });
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});



app.get('/deleteproduct', async (req, res) => {
  try {
    const totalCount = await Product.countDocuments({});
    const products = await Product.find();
    console.log(products)
    
    res.render('productdelete', { products,totalCount });
  } catch (error) {
    console.error(error);
     res.redirect('/404');
  }
  });

  
app.post('/deleteproduct/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);

  try {
    if (!fileId) {
      return res.status(404).send('File not found');
    }

    const elementsfinal = await Product.deleteOne({ _id: fileId });
    

   
    
     const products=await Product.find()
    res.redirect('/deleteproduct')
    
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});


app.get('/deleteproduct', async (req, res) => {
  try {
    const totalCount = await Product.countDocuments({});
    const products = await Product.find();
    console.log(products)
    
    res.render('productdelete', { products,totalCount });
  } catch (error) {
    console.error(error);
     res.redirect('/404');
  }
  });

  app.get('/deletevideo',async(req,res)=>{
    const videoDocument = await video.find();
  console.log(videoDocument)
  res.render('videoremove',{videoDocument});
  })
app.post('/deletevideo/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);

  try {
    if (!fileId) {
      return res.status(404).send('File not found');
    }

    const elementsfinal = await video.deleteOne({ _id: fileId });
    

   
    
     const products=await video.find()
     res.redirect('/deletevideo')
    
  } catch (error) {
    console.error(error);
    res.redirect('/404');
  }
});


app.listen(8000, () => {
  console.log('Server has started on port number 800');
});



