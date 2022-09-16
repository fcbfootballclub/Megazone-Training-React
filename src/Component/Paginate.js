import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";

function Paginate(props) {
  const { data } = props;

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  const body = currentItems.map((item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.fullName}</td>
        <td>{item.assets} billions USD</td>
        <td>{item.age}</td>
        <td>
          <button className="btn btn-primary">Edit</button>
          <button className="btn btn-danger">Delete</button>
        </td>
      </tr>
    );
  });

  return (
    <>
    {body}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Paginate
