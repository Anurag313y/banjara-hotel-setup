import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Download, Building2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StaffStatus = "New" | "Contacted" | "Hired" | "Closed";
type KitchenStatus = "New" | "Processing" | "Delivered" | "Closed";
type CCGStatus = "New" | "Processing" | "Delivered" | "Closed";

interface BusinessRequirement {
  id: number;
  photo: string | null;
  hotelName: string;
  location: string;
  ownerName: string;
  phone: string;
  requirements: string;
  date: string;
  status: string;
}

interface AdminDataTableProps {
  title: string;
  subtitle: string;
  data: BusinessRequirement[];
  statuses: string[];
  statusColors: Record<string, string>;
  onStatusChange: (id: number, newStatus: string) => void;
}

const defaultStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Processing: "bg-purple-500 text-white",
  Hired: "bg-green-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const AdminDataTable = ({ title, subtitle, data, statuses, statusColors, onStatusChange }: AdminDataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<BusinessRequirement | null>(null);

  const filteredData = data.filter((item) => {
    const matchesSearch = item.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by hotel name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Hotel Name</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Owner Name</TableHead>
                <TableHead className="hidden xl:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                      {item.photo ? (
                        <img src={item.photo} alt={item.hotelName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.hotelName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{item.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{item.ownerName}</TableCell>
                  <TableCell className="hidden xl:table-cell text-muted-foreground">{item.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 p-0">
                          <Badge className={`${statusColors[item.status] || defaultStatusColors[item.status]} cursor-pointer`}>
                            {item.status}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {statuses.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onStatusChange(item.id, status)}
                            className={item.status === status ? "bg-muted" : ""}
                          >
                            <Badge className={statusColors[status] || defaultStatusColors[status]}>{status}</Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedItem(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {item.requirements && (
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No requirements found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal - Full Form Data */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Requirement Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  {selectedItem.photo ? (
                    <img src={selectedItem.photo} alt={selectedItem.hotelName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedItem.hotelName}</h3>
                  <p className="text-muted-foreground">{selectedItem.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Owner Name</p>
                  <p className="font-medium">{selectedItem.ownerName}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Contact</p>
                  <p className="font-medium">{selectedItem.phone}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Submitted On</p>
                  <p className="font-medium">{selectedItem.date}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={statusColors[selectedItem.status] || defaultStatusColors[selectedItem.status]}>
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>

              {selectedItem.requirements && (
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Requirements ({selectedItem.requirements})
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Staff Requirements with full data
const staffStatuses: StaffStatus[] = ["New", "Contacted", "Hired", "Closed"];
const staffStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Hired: "bg-green-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const initialStaffData: BusinessRequirement[] = [
  { 
    id: 1, 
    photo: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=150&fit=crop",
    hotelName: "Grand Palace Hotel", 
    location: "Mumbai", 
    ownerName: "Vikram Shah", 
    phone: "+91 98765 43210", 
    requirements: "staff_requirements.pdf",
    date: "2024-01-15", 
    status: "New" 
  },
  { 
    id: 2, 
    photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop",
    hotelName: "Royal Inn", 
    location: "Delhi", 
    ownerName: "Anita Gupta", 
    phone: "+91 98765 43211", 
    requirements: "royal_inn_staff.pdf",
    date: "2024-01-14", 
    status: "Contacted" 
  },
  { 
    id: 3, 
    photo: null,
    hotelName: "Sunset Resort", 
    location: "Goa", 
    ownerName: "James D'Souza", 
    phone: "+91 98765 43212", 
    requirements: "sunset_staff.pdf",
    date: "2024-01-13", 
    status: "New" 
  },
];

export const AdminStaff = () => {
  const [staffData, setStaffData] = useState<BusinessRequirement[]>(initialStaffData);

  const handleStatusChange = (id: number, newStatus: string) => {
    setStaffData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  return (
    <AdminDataTable 
      title="Staff Requirements" 
      subtitle={`${staffData.length} total requirements`}
      data={staffData}
      statuses={staffStatuses}
      statusColors={staffStatusColors}
      onStatusChange={handleStatusChange}
    />
  );
};

// Kitchen Equipment with full data
const kitchenStatuses: KitchenStatus[] = ["New", "Processing", "Delivered", "Closed"];
const kitchenStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Processing: "bg-purple-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const initialKitchenData: BusinessRequirement[] = [
  { 
    id: 1, 
    photo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&h=150&fit=crop",
    hotelName: "The Oberoi", 
    location: "Bangalore", 
    ownerName: "Suresh Menon", 
    phone: "+91 98765 43210", 
    requirements: "oberoi_kitchen.pdf",
    date: "2024-01-15", 
    status: "New" 
  },
  { 
    id: 2, 
    photo: null,
    hotelName: "Cafe Mocha", 
    location: "Pune", 
    ownerName: "Ritu Kapoor", 
    phone: "+91 98765 43211", 
    requirements: "cafe_kitchen.pdf",
    date: "2024-01-14", 
    status: "New" 
  },
];

export const AdminKitchen = () => {
  const [kitchenData, setKitchenData] = useState<BusinessRequirement[]>(initialKitchenData);

  const handleStatusChange = (id: number, newStatus: string) => {
    setKitchenData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  return (
    <AdminDataTable 
      title="Kitchen Equipment" 
      subtitle={`${kitchenData.length} total requirements`}
      data={kitchenData}
      statuses={kitchenStatuses}
      statusColors={kitchenStatusColors}
      onStatusChange={handleStatusChange}
    />
  );
};

// CCG Requirements with full data
const ccgStatuses: CCGStatus[] = ["New", "Processing", "Delivered", "Closed"];
const ccgStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Processing: "bg-purple-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const initialCCGData: BusinessRequirement[] = [
  { 
    id: 1, 
    photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=150&h=150&fit=crop",
    hotelName: "Taj Mahal Palace", 
    location: "Mumbai", 
    ownerName: "Rahul Mehra", 
    phone: "+91 98765 43210", 
    requirements: "taj_ccg.pdf",
    date: "2024-01-15", 
    status: "New" 
  },
  { 
    id: 2, 
    photo: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=150&h=150&fit=crop",
    hotelName: "ITC Grand", 
    location: "Chennai", 
    ownerName: "Lakshmi Iyer", 
    phone: "+91 98765 43211", 
    requirements: "itc_ccg.pdf",
    date: "2024-01-14", 
    status: "Processing" 
  },
  { 
    id: 3, 
    photo: null,
    hotelName: "Marriott", 
    location: "Hyderabad", 
    ownerName: "Arun Reddy", 
    phone: "+91 98765 43212", 
    requirements: "marriott_ccg.pdf",
    date: "2024-01-13", 
    status: "Delivered" 
  },
];

export const AdminCCG = () => {
  const [ccgData, setCCGData] = useState<BusinessRequirement[]>(initialCCGData);

  const handleStatusChange = (id: number, newStatus: string) => {
    setCCGData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  return (
    <AdminDataTable 
      title="CCG Requirements" 
      subtitle={`${ccgData.length} Cutlery, Crockery & Glassware requirements`}
      data={ccgData}
      statuses={ccgStatuses}
      statusColors={ccgStatusColors}
      onStatusChange={handleStatusChange}
    />
  );
};

export default AdminDataTable;
