import React, { useState, useMemo } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const DataTable = ({
  data = [],
  columns = [],
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  onShare,
  selectable = false,
  onSelectionChange,
  pagination = true,
  pageSize = 10,
  searchable = false,
  sortable = true,
  actions = true,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(row => row.id));
      setSelectedRows(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
  };

  const formatCellValue = (value, column) => {
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('en-IN');
    }
    
    if (column.type === 'status') {
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-blue-100 text-blue-800',
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      );
    }
    
    if (column.type === 'badge') {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      );
    }
    
    return value;
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gray-50/50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:bg-gray-100/50' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/50">
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                className={`hover:bg-gray-50/50 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${selectedRows.has(row.id) ? 'bg-blue-50/50' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(row.id, e.target.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCellValue(row[column.key], column)}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors duration-150"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors duration-150"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(row);
                          }}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded-lg hover:bg-purple-50 transition-colors duration-150"
                          title="Duplicate"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onShare && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(row);
                          }}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded-lg hover:bg-orange-50 transition-colors duration-150"
                          title="Share"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors duration-150"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="bg-gray-50/50 px-6 py-3 flex items-center justify-between border-t border-gray-200/50">
          <div className="flex items-center text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
