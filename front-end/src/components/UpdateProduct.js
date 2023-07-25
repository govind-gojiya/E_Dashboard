import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const UpdateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [company, setCompany] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const configHeader = {
        headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
    }

    const updateProduct = async () => {

        if(!name || !price || !company || !category) {
            setError(true);
            return false;
        }

        await axios.put(`${apiUrl}/api/updateProduct/${params.id}`, {    
            name,
            price: Number(price),
            company,
            category,
            userId: JSON.parse(localStorage.getItem('user'))._id
        }, configHeader).then((response) => {
            console.log(response);
            if(response.data.success) {
                alert("Product Updated Successfully");
            } else {
                alert("Something went wrong \nError : " + response.data.error);
                localStorage.clear();
                navigate('/login');
            }
        }).catch((err) => {
            console.log(err);
        });

        navigate('/');
    };

    const getProduct = async () => {
        const id = params.id;
        console.log(id);
        await axios.get(`${apiUrl}/api/getProduct/${id}`, configHeader).then((response) => {
            console.log(response);
            if(response.data.success) {
                const product = response.data.response;
                setName(product.name);
                setPrice(product.price);
                setCompany(product.company);
                setCategory(product.category);
                if(product.category) {
                    document.getElementById('categoryBox').value = product.category;
                }
            } else {
                alert("Something went wrong \nError : " + response.data.error);
                localStorage.clear();
                navigate('/login');
            }
        }).catch((err) => {
            console.log(err);
        }
        );
    }

    // eslint-disable-next-line
    useEffect(() => {
        getProduct();
    }, []);

    return (
        <div className="addProductPage">
            <h1>Update Product</h1>
            <input type="text" placeholder="Enter Product Name"
            value={name} onChange={(e) => setName(e.target.value)} />
            { error && !name && <span className="error">Please enter product name</span>}

            <input type="text" placeholder="Enter Product Price"
            value={price} onChange={(e) => setPrice(e.target.value)} />
            { error && !price && <span className="error">Please enter product price</span>}

            <input type="text" placeholder="Enter Product Company"
            value={company} onChange={(e) => setCompany(e.target.value)} />
            { error && !company && <span className="error">Please enter product company</span>}

            <select onChange={(e) => setCategory(e.target.value)} id="categoryBox">
                <option disabled selected>Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Laptops">Laptops</option>
                <option value="Books">Books</option>
                <option value="Clothes/Shoes">Clothes/Shoes</option>
                <option value="Beauty/Health">Beauty/Health</option>
                <option value="Cameras">Cameras</option>
                <option value="Accessories">Accessories</option>
                <option value="Headphones">Headphones</option>
                <option value="Food">Food</option>
                <option value="Sports">Sports</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Home">Home</option>
            </select>
            { error && !category && <span className="error">Please select product category</span>}

            <button onClick={updateProduct} type="button">Update</button>
        </div>
    )
}

export default UpdateProduct;