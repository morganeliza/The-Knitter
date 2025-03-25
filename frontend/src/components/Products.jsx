// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundVideo from "./BackgroundVideo";


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
          productsFromApp.map((product) => {
            return (
              <>
                <div className="Product">
                  <h2 id="name">{product.name}</h2>
                  <img onClick={()=> getMoreDetails(product.id)}
                    className="image"
                    src={product.image_url}
                    alt={product.name}
                  />
                  <h3 id="price">${product.price}</h3>
                  <h3 id="color">{product.color}</h3>
                  <h2>{product.description}</h2>
                  <div>
                    <button
                      id="addtocart"
                      onClick={() => getMoreDetails(product.id)}
                    >
                      add to cart
                    </button>
                    <button
                      id="leavereview"
                      onClick={() => getMoreDetails(product.id)}
                    >
                      leave a review
                    </button>
                  </div>
                  
                </div>
                
              </>
            );
          })}
      </div>
    </>
  );
}
