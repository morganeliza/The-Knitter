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
                  <h3>{product.price}</h3>
                  <h5>{product.description}</h5>
                  <button id="status" onClick={() => getMoreDetails(product.id)}>
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
