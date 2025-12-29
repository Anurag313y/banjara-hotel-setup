import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye, Download, User, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

type JobSeekerStatus = "New" | "Contacted" | "Closed";

interface JobSeeker {
  id: string;
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

const jobSeekerStatuses: JobSeekerStatus[] = ["New", "Contacted", "Closed"];

const statusColors: Record<JobSeekerStatus, string> = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-amber-500 text-white",
  Closed: "bg-gray-500 text-white",
};

const AdminJobSeekers = () => {
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeeker | null>(null);

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const { data, error } = await supabase
        .from('job_seekers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: JobSeeker[] = (data || []).map(item => ({
        id: item.id,
        photo: item.photo_url,
        name: item.full_name,
        age: item.age?.toString() || "",
        location: item.location || "",
        profile: item.job_profile,
        experience: item.experience || "",
        phone: item.phone,
        lastSalary: item.last_salary || "",
        expectedSalary: item.expected_salary || "",
        resume: item.resume_url,
        date: new Date(item.created_at).toLocaleDateString(),
        status: "New" as JobSeekerStatus, // Default status - could be stored in DB later
      }));

      setJobSeekers(mapped);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: JobSeekerStatus) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <a href={seeker.resume} target="_blank" rel="noopener noreferrer">
                          <Download className="w-3 h-3 mr-1" />
                          Resume
                        </a>
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
                  <TableCell>{seeker.age ? `${seeker.age} yrs` : "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{seeker.location || "-"}</TableCell>
                  <TableCell>{seeker.profile}</TableCell>
                  <TableCell>{seeker.experience ? `${seeker.experience} yrs` : "-"}</TableCell>
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
                        <Button variant="ghost" size="icon" asChild>
                          <a href={seeker.resume} target="_blank" rel="noopener noreferrer">
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
                  <p className="font-medium text-sm">{selectedSeeker.age ? `${selectedSeeker.age} years` : "-"}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium text-sm">{selectedSeeker.location || "-"}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Work Experience</p>
                  <p className="font-medium text-sm">{selectedSeeker.experience ? `${selectedSeeker.experience} years` : "-"}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Phone Number</p>
                  <p className="font-medium text-sm">{selectedSeeker.phone}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Last Salary</p>
                  <p className="font-medium text-sm">{selectedSeeker.lastSalary ? `₹${selectedSeeker.lastSalary}/month` : "-"}</p>
                </div>
                <div className="bg-muted/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Expected Salary</p>
                  <p className="font-medium text-sm">{selectedSeeker.expectedSalary ? `₹${selectedSeeker.expectedSalary}/month` : "-"}</p>
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
                <Button variant="secondary" className="w-full" asChild>
                  <a href={selectedSeeker.resume} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
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

export default AdminJobSeekers;
