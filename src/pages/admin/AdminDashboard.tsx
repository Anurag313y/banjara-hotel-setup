import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users, ChefHat, Wine, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data
const categoryData = [
  { name: "Jobs", count: 24, icon: Briefcase, path: "/admin/jobs", color: "hsl(20, 70%, 45%)" },
  { name: "Staff", count: 12, icon: Users, path: "/admin/staff", color: "hsl(38, 80%, 55%)" },
  { name: "Kitchen", count: 8, icon: ChefHat, path: "/admin/kitchen", color: "hsl(140, 20%, 45%)" },
  { name: "CCG", count: 15, icon: Wine, path: "/admin/ccg", color: "hsl(25, 20%, 50%)" },
];

const chartData = [
  { name: "Jobs", value: 24, fill: "hsl(20, 70%, 45%)" },
  { name: "Staff", value: 12, fill: "hsl(38, 80%, 55%)" },
  { name: "Kitchen", value: 8, fill: "hsl(140, 20%, 45%)" },
  { name: "CCG", value: 15, fill: "hsl(25, 20%, 50%)" },
];

type TimeFilter = "today" | "7days" | "30days" | "custom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days");

  const totalSubmissions = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Dashboard & Analytics</h1>
          <p className="text-muted-foreground mt-1">Overview of all submissions</p>
        </div>

        {/* Time Filter */}
        <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
          <SelectTrigger className="w-[180px]">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categoryData.map((category, index) => (
          <Card 
            key={category.name}
            className="cursor-pointer hover:shadow-elevated transition-all opacity-0 animate-fade-up group"
            style={{ animationDelay: `${0.1 + index * 0.1}s`, animationFillMode: "forwards" }}
            onClick={() => navigate(category.path)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div 
                  className="p-2 rounded-lg" 
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">{category.name} Forms</p>
              <p className="text-2xl font-bold font-display">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Card */}
      <Card className="mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">Total Submissions</p>
            <p className="text-4xl font-bold font-display mt-1">{totalSubmissions}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
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
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
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
