import { Box, Card, CardContent, Typography } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { DerivedTask } from '@/types';

interface Props {
  tasks: DerivedTask[];
}

export default function ChartsDashboard({ tasks }: Props) {
  // cap chart values so small numbers remain visible
  const MAX_REVENUE_DISPLAY = 100_000;
  const revenueByPriority = ['High', 'Medium', 'Low'].map(p => {
    const revenue = tasks
      .filter(t => t.priority === (p as any))
      .reduce((s, t) => s + (Number.isFinite(t.revenue) ? t.revenue : 0), 0);
    return { priority: p, revenue: Math.min(revenue, MAX_REVENUE_DISPLAY) };
  })

  const revenueByStatus = ['Todo', 'In Progress', 'Done'].map(s => {
    const revenue = tasks
      .filter(t => t.status === (s as any))
      .reduce((s2, t) => s2 + (Number.isFinite(t.revenue) ? t.revenue : 0), 0);
    return { status: s, revenue: Math.min(revenue, MAX_REVENUE_DISPLAY) };
  });
  // Injected bug: assume numeric ROI across the board; mis-bucket null/NaN
  // Removed Bug: Safe ROI bucketing: handle null/NaN values correctly
  // Tasks with invalid or missing ROI are counted under 'N/A'
  // Prevents crashes or mis-bucketing in charts
  const roiBuckets = [
    { label: '<200', count: tasks.filter(t => t.roi != null && t.roi < 200).length },
    { label: '200-500', count: tasks.filter(t => t.roi != null && t.roi >= 200 && t.roi <= 500).length },
    { label: '>500', count: tasks.filter(t => t.roi != null && t.roi > 500).length },
    { label: 'N/A', count: tasks.filter(t => t.roi == null).length },
  ]

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>Insights</Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">Revenue by Priority</Typography>
            <BarChart
              height={240}
              xAxis={[{ scaleType: 'band', data: revenueByPriority.map(d => d.priority) }]}
              series={[{ data: revenueByPriority.map(d => d.revenue), color: '#4F6BED' }]}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Revenue by Status</Typography>
            <PieChart
              height={240}
              series={[{
                data: revenueByStatus.map((d, i) => ({ id: i, label: d.status, value: d.revenue })),
              }]}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">ROI Distribution</Typography>
            <BarChart
              height={240}
              xAxis={[{ scaleType: 'band', data: roiBuckets.map(b => b.label) }]}
              series={[{ data: roiBuckets.map(b => b.count), color: '#22A699' }]}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}


