import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users, ChefHat, Wine, ArrowRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

type TimeFilter = "today" | "7days" | "30days" | "custom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    jobs: 0,
    staff: 0,
    kitchen: 0,
    ccg: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, [timeFilter]);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      // Get date filter
      let dateFilter = new Date();
      if (timeFilter === "today") {
        dateFilter.setHours(0, 0, 0, 0);
      } else if (timeFilter === "7days") {
        dateFilter.setDate(dateFilter.getDate() - 7);
      } else if (timeFilter === "30days") {
        dateFilter.setDate(dateFilter.getDate() - 30);
      }

      // Fetch job seekers count
      const { count: jobsCount } = await supabase
        .from('job_seekers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateFilter.toISOString());

      // Fetch businesses count by type
      const { data: businesses } = await supabase
        .from('businesses')
        .select('business_type')
        .gte('created_at', dateFilter.toISOString());

      const staffCount = businesses?.filter(b => b.business_type === 'staff').length || 0;
      const kitchenCount = businesses?.filter(b => b.business_type === 'kitchen').length || 0;
      const ccgCount = businesses?.filter(b => b.business_type === 'ccg').length || 0;

      setCounts({
        jobs: jobsCount || 0,
        staff: staffCount,
        kitchen: kitchenCount,
        ccg: ccgCount,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryData = [
    { name: "Jobs", count: counts.jobs, icon: Briefcase, path: "/admin/jobs", color: "hsl(20, 70%, 45%)" },
    { name: "Staff", count: counts.staff, icon: Users, path: "/admin/staff", color: "hsl(38, 80%, 55%)" },
    { name: "Kitchen", count: counts.kitchen, icon: ChefHat, path: "/admin/kitchen", color: "hsl(140, 20%, 45%)" },
    { name: "CCG", count: counts.ccg, icon: Wine, path: "/admin/ccg", color: "hsl(25, 20%, 50%)" },
  ];

  const chartData = [
    { name: "Jobs", value: counts.jobs, fill: "hsl(20, 70%, 45%)" },
    { name: "Staff", value: counts.staff, fill: "hsl(38, 80%, 55%)" },
    { name: "Kitchen", value: counts.kitchen, fill: "hsl(140, 20%, 45%)" },
    { name: "CCG", value: counts.ccg, fill: "hsl(25, 20%, 50%)" },
  ];

  const totalSubmissions = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of all submissions</p>
        </div>

        {/* Time Filter */}
        <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {categoryData.map((category, index) => (
          <Card 
            key={category.name}
            className="cursor-pointer hover:shadow-elevated transition-all opacity-0 animate-fade-up group"
            style={{ animationDelay: `${0.1 + index * 0.1}s`, animationFillMode: "forwards" }}
            onClick={() => navigate(category.path)}
          >
            <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div 
                  className="p-1.5 sm:p-2 rounded-lg" 
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: category.color }} />
                </div>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">{category.name} Forms</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold font-display">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Card */}
      <Card className="mb-6 sm:mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display mt-1">{totalSubmissions}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {timeFilter === "today" && "Today"}
              {timeFilter === "7days" && "Last 7 days"}
              {timeFilter === "30days" && "Last 30 days"}
              {timeFilter === "custom" && "Custom period"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="opacity-0 animate-fade-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
