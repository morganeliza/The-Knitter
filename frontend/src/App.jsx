import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import React from "react";
import Account from "./components/Account";
import Products from "./components/Products";
import Login from "./components/Login";
import Register from "./components/Register";
import SingleProductDetails from "./components/SingleProductDetails";
import CommentForm from "./components/CommentForm";
import ReviewForm from "./components/ReviewForm";
import ReviewsList from "./components/ReviewsList";
import BackgroundVideo from "./components/BackgroundVideo";
import "./index.css";
import { getProducts } from "./api";
import { useNavigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [productsInApp, setProductsInApp] = useState([]);
  // const [products, setProducts] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllProducts() {
      const productsFromApi = await getProducts();
      console.log(productsFromApi);

      setProductsInApp(productsFromApi.allProducts);
    }
    getAllProducts();
  }, []);

  const handleLogout = () => {
    setToken(null); // clear token state
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredProducts = productsInApp.filter(
    (product) =>
      product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      product.color.toLowerCase().includes(searchParam.toLowerCase())
  );
  return (
    <>
      <div>
        <BackgroundVideo />
      </div>

      <div className="container">
        <div className="navbar">
          <Link to={"/"}>
            <button className="navbutton">
              <h2>Home</h2>
            </button>
          </Link>
          <Link to={"/"}>
            <button className="navbutton">
              <h2>Accessories and Notions</h2>
            </button>
          </Link>
          <Link to={"/register"}>
            <button className="navbutton">
              <h2>Become a Member</h2>
            </button>
          </Link>
          {token ? (
            <Link to={"/users/me"}>
              <button className="navbutton">
                <h2>My Stash</h2>
              </button>
            </Link>
          ) : (
            <Link to={"/login"}>
              <button className="navbutton">
                <h2>Login</h2>
              </button>
            </Link>
          )}
          <Link to={"/"}>
            <button className="navbutton" onClick={() => handleLogout()}>
              <h2>Logout</h2>
            </button>
          </Link>
          <div>
            <img
              className="cart"
              src="./shopping-cart.png"
              alt="shopping cart"
            />
          </div>

          <div className="container">
            <div className="search-container">
              <input
                type="text"
                id="search"
                placeholder="search brand, name or color"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Link to={"/"}>
          <h1 className="title">The Knitter</h1>
          <h4 className="shipping">We ship internationally!</h4>
        </Link>

        <div>
          <Routes>
            <Route
              path="/"
              element={<Products productsFromApp={filteredProducts} />}
            />
            <Route
              path="/:id"
              element={<SingleProductDetails token={token} />}
            />
            <Route
              path="/register"
              element={<Register setToken={setToken} />}
            />
            <Route path="/login" element={<Login setToken={setToken} />} />

            <Route path="/users/me" element={<Account setToken={setToken} />} />
            <Route path="/reviews" element={<ReviewForm token={token} />} />
            <Route path="/comments" element={<CommentForm token={token} />} />
            <Route path="/reviews" element={<ReviewsList token={token} />} />
            <Route path="/" element={<BackgroundVideo />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
