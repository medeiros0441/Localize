import React from 'react';
import Tooltip from '@objetos/Tooltip'
const Table = ({ dataHeader, columns, rows }) => {
  return (
    <div className="my-2 container-fluid p-1">
      {/* Título e botão de ação */}
      <div className="d-flex container-xxl justify-content-between mb-2 row   mx-auto p-1">
        <h1 className="text-start col" style={{ fontSize: '1.0rem' }}>
          <i className={`bi bi-${dataHeader.icon}-fill`}></i> {dataHeader.title}
        </h1>
        <button
          onClick={dataHeader.onClickBtn}
          type="button"
          className="btn btn-success btn-sm col-auto mx-auto me-sm-2"
          style={{ fontSize: '0.8rem' }}
        >
          <i className={`bi bi-${dataHeader.iconBtn} me-1`} style={{ fontSize: '0.8rem' }}></i>
          {dataHeader.buttonText}
        </button>
      </div>

      {/* Tabela */}
      <div className="container-xxl p-3 mx-auto bg-dark rounded">
        <div className="table-responsive">
          <table className="table table-hover table-sm table-dark">
            <thead>
              <tr className="font-monospace" style={{ fontSize: '0.8rem' }}>
                {columns.map((colTitle, index) => (
                  <th key={index} scope="col" className={`${index === 0 ? 'text-start' : index === columns.length - 1 ? 'text-end pe-2' : 'text-center'}`}>
                    {colTitle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="font-monospace" style={{ fontSize: '0.8rem' }}>
                  {row.data.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`${cellIndex === 0 ? 'text-start' : 'text-center'} align-middle`}>
                      {cell}
                    </td>
                  ))}
                <td className="text-end align-middle">
                  <div className="btn-group-sm btn-group pe-2" role="group" aria-label="Ações">
                      {row.actions.map((action) => (
                          <button
                              key={action.id || action.name} // Use action.id se disponível, caso contrário, action.name
                              type="button"
                              className={`btn btn-${action.type} btn-sm`}
                              onClick={action.onClick}
                          >
                              <Tooltip content={action.name} position="top">
                                  <i className={`bi bi-${action.icon}`}></i>
                              </Tooltip>
                          </button>
                      ))}
                  </div>
              </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>


  );
};

export default Table;
