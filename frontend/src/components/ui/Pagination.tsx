import React from 'react';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, pageSize, totalPages, onChange }: PaginationProps) {
  const canGoPrev = current > 1;
  const canGoNext = current < totalPages;

  const handlePrevClick = () => {
    if (canGoPrev) onChange(current - 1);
  };

  const handleNextClick = () => {
    if (canGoNext) onChange(current + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        共 <span className="font-medium">{total}</span> 条 · 每页 <span className="font-medium">{pageSize}</span> 条
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevClick}
          disabled={!canGoPrev}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          上一页
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 py-2 text-gray-600">...</span>
            ) : (
              <button
                onClick={() => onChange(page as number)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  page === current
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={handleNextClick}
          disabled={!canGoNext}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
