import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
  renderActions,
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const value = row[col.key];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }, [data, search, columns]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card">
      <div className="table-toolbar">
        <div className="table-search">
          <Search size={16} className="table-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          {filteredData.length} items
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={col.width ? { width: col.width } : {}}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || renderActions) && <th style={{ width: '100px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || renderActions ? 1 : 0)}
                  style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.id}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || renderActions) && (
                    <td>
                      <div className="table-actions">
                        {renderActions ? (
                          renderActions(row)
                        ) : (
                          <>
                            {onEdit && (
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                onClick={() => onEdit(row)}
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                onClick={() => onDelete(row)}
                                title="Delete"
                                style={{ color: 'var(--color-danger)' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <span className="table-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <div className="table-pagination-btns">
            <button
              className="btn btn-ghost btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              className="btn btn-ghost btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
