'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { User, Clock, CheckCircle, XCircle, Eye, ChevronRight, ChevronLeft, Shield, UserCog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useImperativeHandle, forwardRef, useMemo, useState } from "react";
import { exportRentals, exportUsers, type ExportFormat } from "@/utils/export";

const ITEMS_PER_PAGE = 10;

type UserRole = 'lender' | 'admin';
export type RentalStatus = 'all' | 'pending' | 'approved' | 'rejected';
export type UserRoleFilter = 'all' | 'admin' | 'lender' | 'renter';

export interface RentalData {
  id: string;
  name: string;
  equipment: string;
  date: string;
  duration: string;
  location: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  statusText: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  date: string;
  location: string;
  role: 'admin' | 'lender' | 'renter';
  roleText: string;
}

interface DashboardTableProps {
  userRole: UserRole;
  statusFilter?: RentalStatus;
  roleFilter?: UserRoleFilter;
  searchQuery?: string;
}

export interface DashboardTableRef {
  exportData: (format?: ExportFormat) => void;
  getFilteredData: () => RentalData[] | UserData[];
}

const rentalData: RentalData[] = [
  {
    id: '1',
    name: 'John Doe',
    equipment: 'Tractor X200',
    date: 'Dec 1, 2025',
    duration: '3 days',
    location: 'Manila',
    email: 'john.doe@example.com',
    status: 'pending',
    statusText: 'Pending',
  },
  {
    id: '2',
    name: 'Doe John',
    equipment: 'Tractor X200',
    date: 'Dec 5, 2025',
    duration: '3 days',
    location: 'Manila',
    email: 'doe.johm@example.com',
    status: 'pending',
    statusText: 'Pending',
  }
];

const userData: UserData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    date: 'Jan 15, 2024',
    location: 'Manila',
    role: 'lender',
    roleText: 'Lender'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    date: 'Feb 20, 2024',
    location: 'Cebu',
    role: 'renter',
    roleText: 'Renter'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@agroecom.com',
    date: 'Jan 1, 2024',
    location: 'Manila',
    role: 'admin',
    roleText: 'Admin'
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'lender':
      return 'bg-blue-100 text-blue-800';
    case 'renter':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
      return <Shield className="mr-1 h-3 w-3" />;
    case 'lender':
      return <UserCog className="mr-1 h-3 w-3" />;
    default:
      return <User className="mr-1 h-3 w-3" />;
  }
};

const DashboardTable = forwardRef<DashboardTableRef, DashboardTableProps>(
  function DashboardTable({ userRole, statusFilter = 'all', roleFilter = 'all', searchQuery = '' }, ref) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  
  const isAdmin = userRole === 'admin';
  const title = isAdmin ? 'User Accounts' : 'Review';

  const filteredData = useMemo(() => {
    if (isAdmin) {
      let filtered = [...userData];
      
      if (roleFilter !== 'all') {
        filtered = filtered.filter(item => item.role === roleFilter);
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    } else {
      let filtered = [...rentalData];
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(item => item.status === statusFilter);
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.equipment.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    }
  }, [isAdmin, statusFilter, roleFilter, searchQuery]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  
  // Clamp currentPage to valid range when filters change
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  // Reset page if it's out of bounds
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (validCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = validCurrentPage - 1; i <= validCurrentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const tableData = paginatedData;

  useImperativeHandle(ref, () => ({
    exportData: (format: ExportFormat = 'csv') => {
      if (isAdmin) {
        const userExportData = (filteredData as UserData[]).map(({ id, name, email, date, location, role }) => ({
          id, name, email, date, location, role
        }));
        exportUsers(userExportData, format);
      } else {
        const rentalExportData = (filteredData as RentalData[]).map(({ id, name, equipment, date, duration, location, email, status }) => ({
          id, name, equipment, date, duration, location, email, status
        }));
        exportRentals(rentalExportData, format);
      }
    },
    getFilteredData: () => filteredData
  }), [isAdmin, filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{isAdmin ? 'Role' : 'Status'}</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <User className="h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm font-medium">No {isAdmin ? 'users' : 'rentals'} found</p>
                      <p className="text-xs text-gray-400">Data will appear here when available</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {!isAdmin && 'equipment' in item && (
                            <div className="text-sm text-gray-500">{item.equipment}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{item.date}</div>
                      {!isAdmin && 'duration' in item && (
                        <div className="text-sm text-gray-500">{item.duration}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>{item.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={item.email}>
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && 'role' in item ? (
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(item.role)}`}>
                          {getRoleIcon(item.role)}
                          {item.roleText}
                        </div>
                      ) : (
                        'status' in item && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                            {item.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                            {item.status === 'approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {item.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                            {item.statusText}
                          </div>
                        )
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-start gap-2">
                        {isAdmin ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-1 hover:bg-gray-100"
                              onClick={() => router.push(`${pathname}/user/${item.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 hover:bg-gray-100"
                            onClick={() => router.push(`${pathname}/renter/${item.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    disabled={validCurrentPage === 1}
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-1">...</span>
                    ) : (
                      <PaginationLink 
                        href="#" 
                        isActive={validCurrentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page as number);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    disabled={validCurrentPage === totalPages}
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default DashboardTable;