import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProducts();
    }, []);

    const getAllProducts = async () => {
        const result = await fetch(`${apiUrl}/api/getProducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${JSON.parse(localStorage.getItem('token'))}`,
                "id": JSON.parse(localStorage.getItem('user'))._id
            }
        });
        const data = await result.json();
        // console.warn("data", data);
        if(data.success) {
            const items = data.response;
            setProducts(items);
        }
    }

    const deleteItem = async (id) => {
        const result = await fetch(`${apiUrl}/api/deleteProduct/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        const data = await result.json();
        if(data.success) {
            alert("Product Deleted Successfully");
        } else {
            alert("Product Not Deleted");
            localStorage.clear();
            navigate('/login');
        }
        getAllProducts();
    };

    const searchItems = async (key) => {
        if(key != "") {
            const result = await fetch(`${apiUrl}/api/search/${key}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `bearer ${JSON.parse(localStorage.getItem('token'))}`,
                    "id": JSON.parse(localStorage.getItem('user'))._id
            }
            });
            const data = await result.json();
            // console.warn("data", data);
            if(data.success) {
                const items = data.response;
                setProducts(items);
            } else {
                alert("Error : " + data.error);
                localStorage.clear();
                navigate('/login');
            }
        } else {
            getAllProducts();
        }
    }

    return(
        <div className="productListPage">
            <h1>All Products</h1>
            <input type="text" placeholder="Search Product" className="searchBar"
            onChange={(e) => searchItems(e.target.value)}/> <br />
            <table>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Company</th>
                        <th>Category</th>
                        <th>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.length>0 ? products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.company}</td>
                                <td>{product.category}</td>
                                <td><Link to={`/update/${product._id}`} className="updateBtn">Update</Link>  <button onClick={() => deleteItem(product._id)} className="deleteBtn">Delete</button></td>
                            </tr>
                        ))
                        : 
                        <tr>
                            <td colSpan="6">No Products</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ProductList;