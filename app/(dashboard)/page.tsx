"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Users, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { PieChart, Pie, Cell } from "recharts"

const revenueData = [
  { month: "Jan", withAds: 600, withoutAds: 800 },
  { month: "Feb", withAds: 700, withoutAds: 650 },
  { month: "Mar", withAds: 500, withoutAds: 900 },
  { month: "Apr", withAds: 800, withoutAds: 750 },
  { month: "May", withAds: 650, withoutAds: 850 },
  { month: "Jun", withAds: 1240, withoutAds: 1240 },
  { month: "Jul", withAds: 700, withoutAds: 600 },
  { month: "Aug", withAds: 750, withoutAds: 700 },
  { month: "Sep", withAds: 650, withoutAds: 800 },
  { month: "Oct", withAds: 600, withoutAds: 700 },
  { month: "Nov", withAds: 700, withoutAds: 650 },
  { month: "Dec", withAds: 650, withoutAds: 700 },
]

const genreData = [
  { name: "Comedy", value: 15, color: "#3b82f6" },
  { name: "Action", value: 20, color: "#ef4444" },
  { name: "Einrichtungen", value: 10, color: "#eab308" },
  { name: "Mystery", value: 15, color: "#3b82f6" },
  { name: "Slice of Life", value: 15, color: "#8b5cf6" },
  { name: "Romance", value: 15, color: "#22c55e" },
  { name: "Drama", value: 10, color: "#f97316" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your admin panel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$51,250</div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span>10%</span>
              <span className="text-muted-foreground">last 30 today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">51,250</div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span>10%</span>
              <span className="text-muted-foreground">last 30 today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">51,250</div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span>10%</span>
              <span className="text-muted-foreground">last 30 today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Statistic</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue subscription added</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="withoutAds"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Without ads"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="withAds"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="With ads"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most watching</CardTitle>
            <p className="text-sm text-muted-foreground">Most watching in the Genres</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">20.00%</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {genreData.map((genre) => (
                  <div key={genre.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: genre.color }} />
                    <span className="text-muted-foreground">{genre.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
