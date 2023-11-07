import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "antd";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
const Table = () => {
  const [data, setData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editRowData, setEditRowData] = useState(null);
  const [isEditing, setIsEditing] = useState(null);

  const itemsPerPage = 10;
  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setData(result.data);
      setFilteredRows(result.data);
    };

    fetchData();
  }, []);

  const startIndex = (currentpage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredRows.slice(startIndex, endIndex);
  const handlePagination = (page) => {
    setCurrentPage(page);
  };
  const handleFilterChange = (value) => {
    let filteredData = data.filter(
      (row) =>
        row.name.toString().toLowerCase().includes(value.toLowerCase()) ||
        row.email.toString().toLowerCase().includes(value.toLowerCase()) ||
        row.role.toString().toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRows(filteredData);
    setCurrentPage(1);
  };
  const handleEdit = (id) => {
    if (isEditing !== null) {
      // Finishing editing
      const newData = [...data];
      const userIndex = newData.findIndex((user) => user.id === isEditing);
      newData[userIndex] = { ...newData[userIndex], ...editRowData };

      setData(newData);
      setFilteredRows(newData);
      setIsEditing(null); // Set isEditing to null to exit editing mode
    } else {
      // Starting a new edit
      setIsEditing(id);
      const rowToEdit = filteredRows.find((user) => user.id === id);
      setEditRowData({ ...rowToEdit });
    }
  };
  const handleDelete = (id) => {
    if (!selectedRows.includes(id)) {
      toast.error("Please select the row to delete.");
      return;
    }

    setFilteredRows((prevFilteredUsers) =>
      prevFilteredUsers.filter((user) => user.id !== id)
    );

    toast.error("Deleted Successfully!");
  };
  const handleRowSelection = (event, id) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== id)
      );
    }
  };

  const handleSelectAllRows = (event) => {
    const { checked } = event.target;
    const allRowIds = currentData.map((row) => row.id);

    setSelectedRows((prevSelectedRows) => {
      if (checked) {
        return [...prevSelectedRows, ...allRowIds];
      } else {
        return prevSelectedRows.filter((rowId) => !allRowIds.includes(rowId));
      }
    });
  };

  const handleDeleteSelected = () => {
    const updatedRows = filteredRows.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setFilteredRows(updatedRows);
    // If we are on the last page and it contains only selected rows
    if (Math.ceil(updatedRows.length / itemsPerPage) < currentpage) {
      setCurrentPage(Math.ceil(updatedRows.length / itemsPerPage) || 1); // or to 1 if no pages left
    }
    setSelectedRows([]);
    toast.error("Selected rows deleted successfully!");
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        {currentData.length > 0 ? (
          <div>
            <Input
              className="form-control"
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder={`Search by name, email or role`}
            />
            <div className="table-responsive">
              <table
                className="table table-bordered"
                role="grid"
                style={{
                  marginBottom: "20px",
                  marginTop: "20px",

                  width: "100%" /* Add this line to set table width to 100% */,
                  boxSizing: "border-box",
                }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>
                      <Input
                        type="checkbox"
                        checked={selectedRows.length === currentData.length}
                        onChange={handleSelectAllRows}
                        className="form-control"
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        selectedRows.includes(row.id) ? "selected" : ""
                      }
                    >
                      <td>
                        <Input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={(event) =>
                            handleRowSelection(event, row.id)
                          }
                        />
                      </td>
                      {isEditing === row.id ? (
                        <>
                          <td>
                            <Input
                              type="text"
                              value={editRowData.name}
                              onChange={(e) =>
                                setEditRowData({
                                  ...editRowData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={editRowData.email}
                              onChange={(e) =>
                                setEditRowData({
                                  ...editRowData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </td>
                          <td>
                            <Input
                              type="text"
                              value={editRowData.role}
                              onChange={(e) => {
                                // console.log(e.target.value);
                                setEditRowData({
                                  ...editRowData,
                                  role: e.target.value,
                                });
                              }}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{row.role}</td>
                        </>
                      )}
                      <td>
                        <a
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={() => handleEdit(row.id)}
                        >
                          {isEditing === row.id ? (
                            <i className="fas fa-save"></i>
                          ) : (
                            <i className="fas fa-edit"></i>
                          )}
                        </a>
                        <a
                          className="deleteicon"
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={() => handleDelete(row.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>{" "}
            <div className="botton">
              <button
                className="delete-button"
                style={{ left: "10px" }}
                onClick={handleDeleteSelected}
                disabled={selectedRows.length === 0}
              >
                Delete Selected
              </button>
              <Pagination
                currentPage={currentpage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredRows.length}
                handlePagination={handlePagination}
              />
            </div>
          </div>
        ) : (
          <p>No entries found</p>
        )}
      </div>
    </>
  );
};

export default Table;
