import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navigations({productsInApp}) {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParam, setSearchParam] = useState("");

  useEffect(() => {
    const filteredProducts = productsInApp.filter(
      (product) =>
        product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        product.color.toLowerCase().includes(searchParam.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  }, [searchParam, productsInApp]);

  if (filteredProducts.length > 0) {
    return (
      <>
        <div className="container">
          {filteredProducts.map((product) => {
            return (
              <div
                className="productdetails"
                key={product.id}
                onClick={() => {
                  navigate(`/${product.id}`);
                }}
              >
                {product.image_url && (
                  <img
                    className="imagedetails"
                    src={product.image_url}
                    alt={`${product.name} image`}
                  />
                )}
                <h1>{product.name}</h1>
                <h5>{product.color}</h5>
                <h2 className="availability">
                  Status Availability:{" "}
                  {product.available ? "available" : "unavailable"}
                </h2>
                <button
                  className="purchase"
                  onClick={() => purchase(product.id, !product.available)}
                >
                  Purchase
                </button>

                <button
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Back
                </button>

                <div className="search-container">
                  <input
                    type="text"
                    id="search"
                    placeholder="search product name or color"
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
