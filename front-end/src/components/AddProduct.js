import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const AddProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [company, setCompany] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState(false);
    const configHeader = {
        headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
    };
    const navigate = useNavigate();

    const addProduct = async () => {

        if(!name || !price || !company || !category) {
            setError(true);
            return false;
        }

        await axios.post(`${apiUrl}/api/addProduct`, {
            name,
            price: Number(price),
            company,
            category,
            userId: JSON.parse(localStorage.getItem('user'))._id
        }, configHeader).then((response) => {
            console.log(response);
            if(response.data.success) {
                alert("Product Added Successfully");
            } else {
                alert("Something went wrong \nError : " + response.data.error);
                localStorage.clear();
                navigate('/login');
            }
        }).catch((err) => {
            console.log(err);
        });
        // console.warn(name, Number(price), company, category);
        setName("");
        setPrice("");
        setCompany("");
        setCategory("");
        setError(false);
        document.getElementById('categoryBox').selectedIndex = 0;
    };

    return (
        <div className="addProductPage">
            <h1>Add Product</h1>
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

            <button onClick={addProduct} type="button">Add Product</button>
        </div>
    )
}

export default AddProduct;