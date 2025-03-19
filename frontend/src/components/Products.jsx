import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import bookimage from "./books.png";

export default function Products({ productsFromApp }) {
  const [products, setProducts] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [productDetails, setProductDetails] = useState({});
  const navigate = useNavigate();
 

  function getMoreDetails(id) {
    navigate(`/${id}`);
  }

  return (
    <>
      <div id="main-library">
        {productsFromApp &&
          booksFromApp.map((book, id) => {
            return (
              <>
                <div className="Book">
                  <h1>{book.title}</h1>
                  <img
                    className="image"
                    src={
                      book.author === "J.R.R. Tolkien"
                        ? bookimage
                        : book.coverimage
                    }
                  />
                  <h3>{book.author}</h3>
                  <h5>{book.description}</h5>
                  <button id="status" onClick={() => getMoreDetails(book.id)}>
                    Status
                  </button>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}
