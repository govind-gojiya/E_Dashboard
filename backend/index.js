const express = require('express');
const app = express();
const connectDB = require('./db/config');
const User = require('./db/User');
const cors = require('cors');
const Product = require('./db/Product');
const Jwt = require('jsonwebtoken');
const JwtKey = "MyFirstMERNProjectReadyToDeploy";
const multer = require('multer');
const fs = require('fs');
// const path = require('path');

app.use(cors());
connectDB();

app.use(express.json());
// app.use(express.static(path.join(__dirname, './build')));
app.use('/uploads', express.static('uploads'));

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "uploads");
        },
        filename: function(req, file, cb) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, file.fieldname + "_" + Date.now() + "." + extension)
        }
    })
}).single("photo");

app.post('/api/register', upload, async (req, res) => {
    // console.log(req.body, req.file);
    const { name, email, password } = req.body;
    const photo = req.file.path;

    try {
        const user = await User.create({
            name,
            email,
            password,
            photo
        });

        let response = await user.save();

        response = response.toObject();
        delete response.password;

        Jwt.sign({ response }, JwtKey, { expiresIn: "3h" }, (err, token) => {
            if(err) {
                return res.status(505).json({
                    success: false,
                    error: 'Something went wrong, try again later.'
                });
            }
            res.status(201).json({
                success: true,
                response,
                auth: token
            });
        })
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.post('/api/login', async (req,res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'Invalid Credentials'
            });
        } else {
            if(password === user.password) {
                user = user.toObject();
                delete user.password;

                Jwt.sign({ user }, JwtKey, { expiresIn: "3h" }, (err, token) => {
                    if(err) {
                        return res.status(505).json({
                            success: false,
                            error: 'Something went wrong, try again later.'
                        });
                    }
                    res.status(200).json({
                        success: true,
                        response: user,
                        auth: token
                    });
                })
            } else {
                return res.status(404).json({
                    success: false,
                    error: 'Invalid Credentials'
                });
            }
        }
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.post('/api/addProduct', verifyToken, async (req,res) => {
    const { name, price, userId, company, category } = req.body;
    
    try {
        const product = await Product.create({
            name,
            price,
            userId,
            company,
            category
        });

        let response = await product.save();

        res.status(201).json({
            success: true,
            response
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.get('/api/getProducts', verifyToken, async (req,res) => {

    const id = req.headers['id'];
    // console.log(id);
    try {
        const products = await Product.find({
            userId: id
        });
        // console.log(products)
        if(!products) {
            return res.status(404).json({
                success: false,
                error: 'No Products Found'
            });
        } else {
            res.status(200).json({
                success: true,
                response: products
            });
        }
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.delete('/api/deleteProduct/:id', verifyToken, async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Product.findByIdAndDelete(id);
        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found'
            });
        }
        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.get('/api/getProduct/:id', verifyToken, async (req,res) => {
    const id = req.params.id;

    try {
        const result = await Product.findById(id);

        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found'
            });
        } 

        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.put('/api/updateProduct/:id', verifyToken, async (req,res) => {
    const id = req.params.id;

    try {    
        const result = await Product.updateOne({ _id: id }, req.body);

        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found'
            });
        }

        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.get('/api/search/:key', verifyToken, async (req,res) => {
    const key = req.params.key;
    const id = req.headers['id'];

    try {
        const result = await Product.find({ 
            "$or": [
                { "name": { "$regex": key, "$options": "i" } },
                { "company": { "$regex": key, "$options": "i" } },
                { "category": { "$regex": key, "$options": "i" } }
            ],
            "userId": id
        });

        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'Product Not Found'
            });
        }

        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if(!token) {
        res.status(403).json({
            success: false,
            error: 'Missing Token, Send authorization token in header.'
        });
    } else {
        token = token.split(" ")[1];
        Jwt.verify(token, JwtKey, (err, valid) => {
            if(err) {
                res.status(401).json({
                    success: false,
                    error: 'Provide Valid Token.'
                });
            } else {
                next();
            }
        })
    }
}

app.post('/api/updateUser', verifyToken, upload, async (req, res) => {
    const { name, password, oldPhoto, id, changePhoto } = req.body;
    // console.log(req.file);
    let newImg;

    try {
        if(changePhoto != "false") {
            newImg = req.file.path;
            // console.log(oldPhoto);
            // let removePhoto = oldPhoto.split(":5000/")[1];
            // console.log(removePhoto);
            fs.unlink(oldPhoto, (err) => {
                // console.log(err);
            });
        } else {
            newImg = oldPhoto;
        }

        let result;

        if(password != "") {
            result = await User.updateOne({_id: id}, {
                name: name,
                password: password,
                photo: newImg
            });
        } else {
            result = await User.updateOne({_id: id}, {
                name: name,
                photo: newImg
            });
        }

        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'User Not Updated'
            });
        }
        
        result = await User.findById(id);
        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'User Not Found'
            });
        }
        
        result = result.toObject();
        delete result.password;

        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

app.post('/api/findUser', verifyToken, async (req, res) => {
    const id = req.body.id;
    // console.log(id);

    try {
        let result = await User.findById(id);
        console.log(result);
        if(!result) {
            return res.status(404).json({
                success: false,
                error: 'User Not Found'
            });
        }

        res.status(200).json({
            success: true,
            response: result
        });
    } catch (err) {
        // console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
})

app.get('/', (req,res) => {
    res.send("Api is listning...");
});

app.listen('5000', () => {
    // console.log("app is running on port no : 5000 ...");
});