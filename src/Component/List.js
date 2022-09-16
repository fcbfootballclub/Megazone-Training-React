import React, { useEffect, useState } from "react";
import Data from "../Data";
import Add from "./Add";
import Search from "./Search";
import ReactPaginate from "react-paginate";
import { CSVLink, CSVDownload } from "react-csv";
import Import from "./Import";
import 'bootstrap/dist/css/bootstrap.min.css';


const List = () => {
  const [data, setData] = useState(Data);
  //console.log("check data", data);

  //search function
  const [searchTerm, setSearchTerm] = useState("");
  const handleOnChangeSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOnClear = () => {
    setSearchTerm("");
  };
  //console.log("check search term ", searchTerm);

  //sort function
  const [sortBy, setSortBy] = useState({
    sortField: "",
  });

  // console.log(">>>after declaration sortby ", sortBy);

  const sortData = (sortField) => {
    if (sortField === "name-asc") {
      setData(
        [...data].sort((a, b) => {
          if (a.fullName >= b.fullName) return 1;
          return -1;
        })
      );
    } else if (sortField === "name-desc") {
      setData(
        [...data].sort((a, b) => {
          if (a.fullName >= b.fullName) return -1;
          return 1;
        })
      );
    } else if (sortField === "assets-asc") {
      setData(
        [...data].sort((a, b) => {
          if (a.assets >= b.assets) return 1;
          return -1;
        })
      );
    } else if (sortField === "assets-desc") {
      setData(
        [...data].sort((a, b) => {
          if (a.assets >= b.assets) return -1;
          return 1;
        })
      );
    } else if (sortField === "age-asc") {
      setData(
        [...data].sort((a, b) => {
          if (a.age >= b.age) return 1;
          return -1;
        })
      );
    } else if (sortField === "age-desc") {
      setData(
        [...data].sort((a, b) => {
          if (a.age >= b.age) return -1;
          return 1;
        })
      );
    }
  };

  const handleOnChangeSortBy = (e) => {
    //console.log("log e target value", e.target.value);
    const a = e.target.value;
    setSortBy({ sortField: a }, sortData(a));
    //console.log(">>>>>>check sort by value ", sortBy.sortField);
  };

  //function pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const endOffset = parseInt(itemOffset) + parseInt(itemsPerPage);
    if (searchTerm === null) {
      setCurrentItems(data.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(data.length / itemsPerPage));
    } else {
      setCurrentItems(
        data
          .filter((item) =>
            item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(itemOffset, endOffset)
      );
      setPageCount(
        Math.ceil(
          data.filter((item) =>
            item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          ).length / itemsPerPage
        )
      );
    }
    // console.log("??????? check per page ", itemsPerPage);
    // console.log("??????? check end of offset ", endOffset);
  }, [itemOffset, itemsPerPage, data, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  //update function variable
  const [edit, setEdit] = useState(false);
  const [rowEdit, setRowEdit] = useState({
    id: 0,
    fullName: "",
    assets: 0,
    age: 0,
  });

  const styleSaveButton = {
    display: edit ? "block" : "none",
  };

  const styleEditButton = {
    display: edit ? "none" : "block",
  };

  //function edit
  const onEdit = (id) => {
    console.log(">>>ID edit ", id);
    setEdit((prev) => !prev);
    setRowEdit(data.find((item) => item.id === id));
  };

  const editOnChangeInput = (e) => {
    setRowEdit((prevState) => {
      const { name, value, type, checked } = e.target;
      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const onSaveEdit = () => {
    setEdit((prev) => !prev);
    setData(
      data.map((item) => {
        if (item.id === rowEdit.id) {
          item.fullName = rowEdit.fullName;
          item.age = rowEdit.age;
          item.assets = rowEdit.assets;
          return item;
        }
        return item;
      })
    );
  };

  //read billionaire from the list
  let listBody = [];
  if (searchTerm !== "") {
    listBody = currentItems
      // .filter((item) =>
      //   item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      // )
      .map((item, index) => {
        return (
          <tr key={index} className={"edit-row"}>
            {edit && rowEdit.id === item.id ? (
              <>
                <td>{item.id}</td>
                <td>
                  <input
                    type={"text"}
                    name={"fullName"}
                    value={rowEdit.fullName}
                    onChange={editOnChangeInput}
                  />
                </td>
                <td>
                  <input
                    type={"number"}
                    name={"assets"}
                    value={rowEdit.assets}
                    onChange={editOnChangeInput}
                  />
                </td>
                <td>
                  <input
                    type={"number"}
                    name={"age"}
                    value={rowEdit.age}
                    onChange={editOnChangeInput}
                  />
                </td>
              </>
            ) : (
              <>
                <td>{item.id}</td>
                <td>{item.fullName}</td>
                <td>{item.assets} billions USD</td>
                <td>{item.age}</td>
              </>
            )}

            <td className="d-flex">
              {edit && rowEdit.id === item.id ? (
                <>
                  <button
                    className="btn btn-primary"
                    style={styleSaveButton}
                    onClick={onSaveEdit}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => onEdit(item.id)}
                    style={styleEditButton}
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                className="btn btn-danger"
                onClick={(e) => deleteBillionaire(item.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      });
  } else {
    listBody = currentItems.map((item, index) => {
      return (
        <tr key={index} className={"edit-row"}>
          {edit && rowEdit.id === item.id ? (
            <>
              <td>{item.id}</td>
              <td>
                <input
                  type={"text"}
                  name={"fullName"}
                  value={rowEdit.fullName}
                  onChange={editOnChangeInput}
                />
              </td>
              <td>
                <input
                  type={"number"}
                  name={"assets"}
                  value={rowEdit.assets}
                  onChange={editOnChangeInput}
                />
              </td>
              <td>
                <input
                  type={"number"}
                  name={"age"}
                  value={rowEdit.age}
                  onChange={editOnChangeInput}
                />
              </td>
            </>
          ) : (
            <>
              <td>{item.id}</td>
              <td>{item.fullName}</td>
              <td>{item.assets} billions USD</td>
              <td>{item.age}</td>
            </>
          )}

          <td className="d-flex">
            {edit && rowEdit.id === item.id ? (
              <>
                <button
                  className="btn btn-primary"
                  style={styleSaveButton}
                  onClick={onSaveEdit}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={(e) => onEdit(item.id)}
                  style={styleEditButton}
                >
                  Edit
                </button>
              </>
            )}

            <button
              className="btn btn-danger"
              onClick={(e) => deleteBillionaire(item.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  }

  //add function
  const add = (billionaire) => {
    const maxId = data.reduce((acc, item) => {
      if (item.id > acc) {
        return item.id;
      }
      return acc;
    }, 0);
    billionaire.id = maxId + 1;
    setData((prev) => [...prev, billionaire]);
  };

  const [showForm, setShowForm] = useState(false);
  const toggleAdd = () => {
    setShowForm((prev) => !prev);
  };
  const style = {
    display: showForm ? "block" : "none",
  };

  //function delete
  const deleteBillionaire = (id) => {
    console.log(">>>>>>>>>>> check delete id ", id);

    if (window.confirm("Delete?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  //function import
  // const importNewData = (addedData) => {
  //   console.log("check added data ", addedData.);
  //   setData(data.concat(addedData.slice(0, addedData.length - 1)));
  //   console.log("Data after inport", data);
  // }

  const[importData, setImportData] = useState([])
  useEffect(() => {
    console.log("import data ", importData);
    setData(data.concat(importData.slice(0, importData.length - 1)))
  }, [importData])

  return (
    <div className="container">
      <p>
        <hr></hr>
      </p>
      <div className="d-flex page-header">
        <div className="page-header-left">
          <Search
            searchTerm={searchTerm}
            func={handleOnChangeSearchTerm}
            func2={handleOnClear}
          />
          <select
            name="sortBy"
            onChange={handleOnChangeSortBy}
            className="form-select sort"
          >
            <option defaultValue={""} disabled selected>
              Sort-by
            </option>
            <option value={"name-asc"}>Name-ASC</option>
            <option value={"name-desc"}>Name-DESC</option>
            <option value={"assets-asc"}>Assets-ASC</option>
            <option value={"assets-desc"}>Assets-DESC</option>
            <option value={"age-asc"}>Age-ASC</option>
            <option value={"age-desc"}>Age-DESC</option>
          </select>
        </div>
        <div className="page-header-right d-flex justify-content-between">
          <div className="block-add-billionaire">
            <button onClick={toggleAdd} className={"btn btn-primary"}>
              + Add billionaire
            </button>
            <span style={style}>
              <Add add={add} />
            </span>
          </div>
          <div className="block-import-export">
            <Import propFunc={setImportData}/>
            <div className="btn btn-success export-button">
              <CSVLink data={data}>Export</CSVLink>
            </div>
          </div>
        </div>
      </div>

      {/* select number of item per page */}
      <div className="item-per-page">
        <select name="" onChange={(e) => setItemsPerPage(e.target.value)} className={'form-select form-select-custom'}>
          <option value={5}>5</option>
          <option defaultValue={10} selected>
            10
          </option>
          <option value={15}>15</option>
        </select>
      </div>

      <br></br>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Full Name</th>
            <th scope="col">Assets</th>
            <th scope="col">Age</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>{listBody}</tbody>
      </table>

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </div>
  );
};

export default List;
