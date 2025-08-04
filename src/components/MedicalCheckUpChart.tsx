import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MedicalCheckupData {
  id: number;
  parameter: string;
  value: string;
  unit: string;
  information: string;
  date: string;
  userId: number;
}

interface MedicalCheckupChartProps {
  data: MedicalCheckupData[];
}

const MedicalCheckupChart: React.FC<MedicalCheckupChartProps> = ({ data }) => {
  const parameters = ["Temperature", "Blood Pressure", "Heart Rate", "SPO2"];

  const dates = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((item) => new Date(item.date).toLocaleDateString())
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        )
      ),
    [data]
  );

  const getChartData = (parameter: string) => {
    const parameterData = data.filter((item) => item.parameter === parameter);
    const values = dates.map((date) => {
      const record = parameterData.find(
        (item) => new Date(item.date).toLocaleDateString() === date
      );
      if (parameter === "Blood Pressure" && record) {
        return parseFloat(record.value.split("/")[0]);
      }
      return record ? parseFloat(record.value) : null;
    });

    const colorMap: { [key: string]: string } = {
      Temperature: "rgba(75, 192, 192, 1)",
      "Blood Pressure": "rgba(255, 99, 132, 1)",
      "Heart Rate": "rgba(54, 162, 235, 1)",
      SPO2: "rgba(255, 206, 86, 1)",
    };

    return {
      labels: dates,
      datasets: [
        {
          label: parameter,
          data: values,
          borderColor: colorMap[parameter],
          backgroundColor: colorMap[parameter].replace("1)", "0.2)"),
          fill: false,
          tension: 0.4,
          spanGaps: true,
        },
      ],
    };
  };

  const getOptions = (parameter: string, unit: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${parameter} Trend`,
        font: {
          size: 14,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${parameter}: ${value} ${unit}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `${unit}`,
          font: {
            size: 12,
          }
        },
        ticks: {
          font: {
            size: 10,
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 12,
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          }
        }
      },
    },
  });

  // Get unit for each parameter
  const unitMap: { [key: string]: string } = {
    Temperature: "°C",
    "Blood Pressure": "mmHg",
    "Heart Rate": "BPM",
    SPO2: "%",
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {parameters.map((parameter) => {
        const parameterData = data.filter((item) => item.parameter === parameter);
        if (parameterData.length === 0) return null;

        return (
          <div
            key={parameter}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="h-64">
              <Line
                data={getChartData(parameter)}
                options={getOptions(parameter, unitMap[parameter])}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MedicalCheckupChart;