import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Download, Building2, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

type StaffStatus = "New" | "Contacted" | "Hired" | "Closed";
type KitchenStatus = "New" | "Processing" | "Delivered" | "Closed";
type CCGStatus = "New" | "Processing" | "Delivered" | "Closed";

interface BusinessRequirement {
  id: string;
  photo: string | null;
  hotelName: string;
  location: string;
  ownerName: string;
  phone: string;
  requirements: string | null;
  date: string;
  status: string;
}

interface AdminDataTableProps {
  title: string;
  subtitle: string;
  data: BusinessRequirement[];
  statuses: string[];
  statusColors: Record<string, string>;
  onStatusChange: (id: string, newStatus: string) => void;
  loading?: boolean;
}

const defaultStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Processing: "bg-purple-500 text-white",
  Hired: "bg-green-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const AdminDataTable = ({ title, subtitle, data, statuses, statusColors, onStatusChange, loading }: AdminDataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<BusinessRequirement | null>(null);

  const filteredData = data.filter((item) => {
    const matchesSearch = item.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <TableCell className="hidden md:table-cell text-muted-foreground">{item.location || "-"}</TableCell>
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
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.requirements} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
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
                  <p className="text-muted-foreground">{selectedItem.location || "-"}</p>
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
                <Button variant="secondary" className="w-full" asChild>
                  <a href={selectedItem.requirements} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Requirements
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Staff Requirements with real data
const staffStatuses: StaffStatus[] = ["New", "Contacted", "Hired", "Closed"];
const staffStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Hired: "bg-green-500 text-white",
  Closed: "bg-gray-500 text-white",
};

export const AdminStaff = () => {
  const [staffData, setStaffData] = useState<BusinessRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('business_type', 'staff')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: BusinessRequirement[] = (data || []).map(item => ({
        id: item.id,
        photo: item.logo_url,
        hotelName: item.hotel_name,
        location: item.location || "",
        ownerName: item.owner_name,
        phone: item.contact_number,
        requirements: item.document_url,
        date: new Date(item.created_at).toLocaleDateString(),
        status: "New",
      }));

      setStaffData(mapped);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
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
      loading={loading}
    />
  );
};

// Kitchen Equipment with real data
const kitchenStatuses: KitchenStatus[] = ["New", "Processing", "Delivered", "Closed"];
const kitchenStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Processing: "bg-purple-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

export const AdminKitchen = () => {
  const [kitchenData, setKitchenData] = useState<BusinessRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('business_type', 'kitchen')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: BusinessRequirement[] = (data || []).map(item => ({
        id: item.id,
        photo: item.logo_url,
        hotelName: item.hotel_name,
        location: item.location || "",
        ownerName: item.owner_name,
        phone: item.contact_number,
        requirements: item.document_url,
        date: new Date(item.created_at).toLocaleDateString(),
        status: "New",
      }));

      setKitchenData(mapped);
    } catch (error) {
      console.error("Error fetching kitchen data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
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
      loading={loading}
    />
  );
};

// CCG Requirements with real data
const ccgStatuses: CCGStatus[] = ["New", "Processing", "Delivered", "Closed"];
const ccgStatusColors: Record<string, string> = {
  New: "bg-blue-500 text-white",
  Processing: "bg-purple-500 text-white",
  Delivered: "bg-emerald-500 text-white",
  Closed: "bg-gray-500 text-white",
};

export const AdminCCG = () => {
  const [ccgData, setCCGData] = useState<BusinessRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('business_type', 'ccg')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: BusinessRequirement[] = (data || []).map(item => ({
        id: item.id,
        photo: item.logo_url,
        hotelName: item.hotel_name,
        location: item.location || "",
        ownerName: item.owner_name,
        phone: item.contact_number,
        requirements: item.document_url,
        date: new Date(item.created_at).toLocaleDateString(),
        status: "New",
      }));

      setCCGData(mapped);
    } catch (error) {
      console.error("Error fetching CCG data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
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
      loading={loading}
    />
  );
};

export default AdminDataTable;
