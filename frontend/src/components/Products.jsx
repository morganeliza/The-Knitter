// import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products({ productsFromApp }) {
  //   const [products, setProducts] = useState([]);
  //   const [searchParam, setSearchParam] = useState("");
  //   const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();

  function getMoreDetails(id) {
    navigate(`/${id}`);
  }

  return (
    <>
      <div id="main-pdp">
        {productsFromApp &&
          productsFromApp.map((product, id) => {
            return (
              <>
                <div className="Product">
                  <h1>{product.name}</h1>
                  <h2 id="price">{product.price}</h2>
                  <img className="image" src={product.image_url} alt={product.name}/>
                  <h2>{product.description}</h2>
                  <button
                    id="status"
                    onClick={() => getMoreDetails(product.id)}
                  >
                    Buy
                  </button>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}
