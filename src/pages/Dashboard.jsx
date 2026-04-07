import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  MessageSquare
} from "lucide-react";
import { getData } from "../services/api";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-[#D6E4FF] rounded-full flex items-center justify-center text-primary mb-6 transition-colors duration-300">
        <Upload size={40} />
      </div>
      <h2 className="text-2xl font-bold text-[#1E293B] mb-2 transition-colors duration-300">No data available</h2>
      <p className="text-[#475569] mb-8 max-w-sm transition-colors duration-300">
        Start a conversation to analyze your decisions.
      </p>
      <Button 
        onClick={() => navigate("/dashboard/chat")}
        className="flex items-center gap-2"
      >
        <MessageSquare size={18} />
        Start AI Chat
      </Button>
    </div>
  );
};

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getData();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  if (!data || data.totalDocuments === "0") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2 transition-colors duration-300">Dashboard</h1>
          <p className="text-[#475569] transition-colors duration-300">Monitor your decision analysis insights.</p>
        </div>
        <Card className="p-12">
          <EmptyState />
        </Card>
      </div>
    );
  }

  // Dashboard content with real data
  const stats = [
    { label: "Total Documents", value: data.totalDocuments || "0", icon: FileText, change: data.docChange || "0%", trend: data.docTrend || "up" },
    { label: "Active Users", value: data.activeUsers || "0", icon: Users, change: data.userChange || "0%", trend: data.userTrend || "up" },
    { label: "Analysis Accuracy", value: data.accuracy || "0%", icon: TrendingUp, change: data.accuracyChange || "0%", trend: data.accuracyTrend || "up" },
    { label: "Avg. Response Time", value: data.responseTime || "0s", icon: Clock, change: data.timeChange || "0s", trend: data.timeTrend || "down" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2 transition-colors duration-300">Welcome back!</h1>
        <p className="text-[#475569] transition-colors duration-300">Here's what's happening with your decision analysis today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D6E4FF] text-primary flex items-center justify-center transition-colors duration-300">
                  <stat.icon size={20} />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.trend === "up" ? "text-emerald-600" : "text-primary"}`}>
                  {stat.change}
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <p className="text-sm font-semibold text-[#475569] mb-1 transition-colors duration-300">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1E293B] transition-colors duration-300">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-[#D6E4FF] flex items-center justify-between transition-colors duration-300">
            <h3 className="font-bold text-[#1E293B]">Recent Documents</h3>
            <button className="text-sm font-semibold text-primary hover:underline">View all</button>
          </div>
          <div className="divide-y divide-[#D6E4FF]">
            {data.recentDocuments?.map((doc, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#D6E4FF]/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D6E4FF] flex items-center justify-center text-primary transition-colors duration-300">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B] transition-colors duration-300">{doc.name}</p>
                    <p className="text-xs text-[#475569] transition-colors duration-300">Uploaded on {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${doc.status === 'Processed' ? 'bg-[#D1FAE5] text-emerald-700' : 'bg-[#D6E4FF] text-primary'}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-[#D6E4FF] transition-colors duration-300">
            <h3 className="font-bold text-[#1E293B]">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-6">
            {data.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "upload" ? "bg-primary" : "bg-blue-400"} transition-colors duration-300`} />
                <div>
                  <p className="text-sm font-medium text-[#1E293B] transition-colors duration-300">
                    <span className="font-bold text-[#1E293B]">{activity.user}</span> {activity.type === "upload" ? "uploaded" : "analyzed"} <span className="text-primary font-bold">{activity.title}</span>
                  </p>
                  <p className="text-xs text-[#475569] mt-1 transition-colors duration-300">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
