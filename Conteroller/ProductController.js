
const model = require('../model/User');
const AddProductModel = require('../model/AddProduct')
const user = model.User;
const product = AddProductModel.scanner;

const JWt = require('jsonwebtoken');

require("dotenv").config();




exports.SinUp = async (req, res) => {

    try {
        const Product = new user(req.body);
        let result = await Product.save();
        result = result.toObject();
        delete result.password;
        if (Product) {
            JWt.sign({ result },process.env.JWtKey , { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    res.send({ result: "something went wrong" })
                }
                res.send({ result, auth: token })
            })
        }
    }
    catch (err) {
        res.send(err.message);
    }
}



exports.Login = async (req, res) => {
    if (req.body.email && req.body.password) {
        const User = await user.findOne(req.body).select("-password");
        if (User) {
            JWt.sign({ User }, process.env.JWtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "something went wrong" })
                }
                res.send({ User, auth: token })
            })

          

        }
        else {
            res.send({ result: 'user not found' })
        }
    }
    else {
        console.log('you are not right a correct emial& password')
        res.send("you are not right a correct emial& password")
    }






}





exports.Addproduct = async (req, res) => {

    const Product = await new product(req.body);
    Product.save();
    res.send(Product);
    console.log(Product);


}


exports.delete = async (req, res) => {
    const id = req.params.id;
    const DeleteUser = await product.findOneAndDelete({ _id: id });
    console.log(DeleteUser);
    res.send(DeleteUser)
}

exports.getProduct =   async (req, res) => {

    const Product = await product.find({});
    res.send(Product);
    console.log("get data sucessfully");

}


exports.getUpdateProduct = async (req, res) => {
    let id = req.params.id;
    const result = await product.findOne({ _id: id });

    if (result) {
        res.send(result)
    }
    else {
        res.send("value is not correct");
    }

}

exports.UpdateProduct = async (req, res) => {
    let id = req.params.id;
    const result = await product.updateOne({ _id: id },
        { $set: req.body }

    )

    res.send(result);
}




exports.SearchProduct = async (req, res) => {

    let key = req.params.key;

    console.log(key);
    const Product = await product.find({
        "$or": [
            { price: { $regex: req.params.key } },
            { ProductName: { $regex: key } }

        ]
    })

    if (Product) {
        res.send(Product);
    }
    else {
        res.send("data is not found")
    }

}



exports.count = async (req, res) => {
    const id = req.params.id;
    const data = await product.findOneAndUpdate({ _id: id },
        {
            $push: {
                updaQuantity: {
                    timestamps: Date.now()

                },
            },

        },
    )
    console.log(data.updaQuantity.length)
    res.send(data)

}


 

