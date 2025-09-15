import React from "react";
import CustomButton from "./CustomButton";
import type { PaginationInfo } from "../types/orders";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  isLoading = false,
}) => {
  const { page, totalPages, total } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Info */}
        <div className="text-sm text-gray-700">
          Mostrando página {page} de {totalPages} ({total} órdenes en total)
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => (
              <React.Fragment key={index}>
                {pageNum === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <CustomButton
                    onClick={() => onPageChange(pageNum as number)}
                    disabled={isLoading}
                    sx={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      minWidth: "40px",
                      backgroundColor:
                        pageNum === page
                          ? "var(--color-primary-500)"
                          : "var(--color-white)",
                      color:
                        pageNum === page
                          ? "var(--color-white)"
                          : "var(--color-gray-700)",
                      border:
                        pageNum === page
                          ? "none"
                          : "1px solid var(--color-gray-300)",
                      "&:hover": {
                        backgroundColor:
                          pageNum === page
                            ? "var(--color-primary-600)"
                            : "var(--color-gray-50)",
                        border:
                          pageNum === page
                            ? "none"
                            : "1px solid var(--color-primary-500)",
                      },
                    }}
                  >
                    {pageNum}
                  </CustomButton>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
