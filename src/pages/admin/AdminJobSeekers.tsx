import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Download, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type JobSeekerStatus = "New" | "Contacted" | "Closed";

interface JobSeeker {
  id: number;
  photo: string | null;
  name: string;
  age: string;
  location: string;
  profile: string;
  experience: string;
  phone: string;
  lastSalary: string;
  expectedSalary: string;
  resume: string | null;
  date: string;
  status: JobSeekerStatus;
}

// Mock data with full form fields
const initialJobSeekers: JobSeeker[] = [
  { 
    id: 1, 
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Rajesh Kumar", 
    age: "28",
    location: "Mumbai", 
    profile: "Chef", 
    experience: "5",
    phone: "+91 98765 43210", 
    lastSalary: "35000",
    expectedSalary: "45000",
    resume: "rajesh_resume.pdf",
    date: "2024-01-15", 
    status: "New" 
  },
  { 
    id: 2, 
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Priya Sharma", 
    age: "24",
    location: "Delhi", 
    profile: "Server", 
    experience: "2",
    phone: "+91 98765 43211", 
    lastSalary: "20000",
    expectedSalary: "28000",
    resume: "priya_resume.pdf",
    date: "2024-01-14", 
    status: "Contacted" 
  },
  { 
    id: 3, 
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Amit Patel", 
    age: "35",
    location: "Ahmedabad", 
    profile: "Manager", 
    experience: "10",
    phone: "+91 98765 43212", 
    lastSalary: "60000",
    expectedSalary: "75000",
    resume: "amit_resume.pdf",
    date: "2024-01-13", 
    status: "Closed" 
  },
  { 
    id: 4, 
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Sneha Reddy", 
    age: "26",
    location: "Hyderabad", 
    profile: "Bartender", 
    experience: "3",
    phone: "+91 98765 43213", 
    lastSalary: "25000",
    expectedSalary: "32000",
    resume: "sneha_resume.pdf",
    date: "2024-01-12", 
    status: "New" 
  },
  { 
    id: 5, 
    photo: null,
    name: "Vikram Singh", 
    age: "30",
    location: "Jaipur", 
    profile: "Housekeeping", 
    experience: "4",
    phone: "+91 98765 43214", 
    lastSalary: "18000",
    expectedSalary: "22000",
    resume: null,
    date: "2024-01-11", 
    status: "New" 
  },
];

const jobSeekerStatuses: JobSeekerStatus[] = ["New", "Contacted", "Closed"];

const statusColors: Record<JobSeekerStatus, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const AdminJobSeekers = () => {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>(initialJobSeekers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeeker | null>(null);

  const handleStatusChange = (id: number, newStatus: JobSeekerStatus) => {
    setJobSeekers(prev => prev.map(seeker => 
      seeker.id === id ? { ...seeker, status: newStatus } : seeker
    ));
  };

  const filteredSeekers = jobSeekers.filter((seeker) => {
    const matchesSearch = seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seeker.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || seeker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground">Job Seekers</h1>
        <p className="text-sm text-muted-foreground mt-1">{jobSeekers.length} total applications</p>
      </div>

      {/* Filters */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10 text-sm"
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
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-3">
        {filteredSeekers.map((seeker) => (
          <Card key={seeker.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {seeker.photo ? (
                    <img src={seeker.photo} alt={seeker.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-sm">{seeker.name}</h3>
                      <p className="text-xs text-muted-foreground">{seeker.profile} • {seeker.location}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 p-0">
                          <Badge className={`${statusColors[seeker.status]} text-xs cursor-pointer`}>
                            {seeker.status}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {jobSeekerStatuses.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(seeker.id, status)}
                            className={seeker.status === status ? "bg-muted" : ""}
                          >
                            <Badge className={statusColors[status]}>{status}</Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{seeker.experience} yrs exp</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{seeker.age} yrs</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSelectedSeeker(seeker)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {seeker.resume && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Job Profile</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeekers.map((seeker) => (
                <TableRow key={seeker.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {seeker.photo ? (
                        <img src={seeker.photo} alt={seeker.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{seeker.name}</TableCell>
                  <TableCell>{seeker.age} yrs</TableCell>
                  <TableCell className="text-muted-foreground">{seeker.location}</TableCell>
                  <TableCell>{seeker.profile}</TableCell>
                  <TableCell>{seeker.experience} yrs</TableCell>
                  <TableCell className="text-muted-foreground">{seeker.phone}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 p-0">
                          <Badge className={`${statusColors[seeker.status]} cursor-pointer`}>
                            {seeker.status}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {jobSeekerStatuses.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(seeker.id, status)}
                            className={seeker.status === status ? "bg-muted" : ""}
                          >
                            <Badge className={statusColors[status]}>{status}</Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedSeeker(seeker)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {seeker.resume && (
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

          {filteredSeekers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No job seekers found
            </div>
          )}
        </CardContent>
      </Card>

      {filteredSeekers.length === 0 && (
        <div className="block lg:hidden text-center py-12 text-muted-foreground">
          No job seekers found
        </div>
      )}

      {/* Detail Modal - Full Form Data */}
      <Dialog open={!!selectedSeeker} onOpenChange={() => setSelectedSeeker(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Applicant Details</DialogTitle>
          </DialogHeader>
          {selectedSeeker && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                  {selectedSeeker.photo ? (
                    <img src={selectedSeeker.photo} alt={selectedSeeker.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">{selectedSeeker.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSeeker.profile}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Age</p>
                  <p className="font-medium text-sm">{selectedSeeker.age} years</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium text-sm">{selectedSeeker.location}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Work Experience</p>
                  <p className="font-medium text-sm">{selectedSeeker.experience} years</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Phone Number</p>
                  <p className="font-medium text-sm">{selectedSeeker.phone}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Last Salary</p>
                  <p className="font-medium text-sm">₹{selectedSeeker.lastSalary}/month</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Expected Salary</p>
                  <p className="font-medium text-sm">₹{selectedSeeker.expectedSalary}/month</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Applied On</p>
                  <p className="font-medium text-sm">{selectedSeeker.date}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge className={statusColors[selectedSeeker.status]}>
                    {selectedSeeker.status}
                  </Badge>
                </div>
              </div>

              {selectedSeeker.resume && (
                <Button variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume ({selectedSeeker.resume})
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobSeekers;
