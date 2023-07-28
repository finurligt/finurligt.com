import React, { Component } from 'react';


interface DataTableProps {
  columns: string[];
  data: string[][];
}

class DataTable extends Component<DataTableProps> {
  render() {
    const { columns, data } = this.props;

    return (
      <div className="container mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataTable;
