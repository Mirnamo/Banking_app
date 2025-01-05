"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // Import the required scale
  LinearScale,   // Import the linear scale (for Y-axis)
  PointElement,
  LineElement,
} from "chart.js";


// Register the required components with Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
interface Account {
  name: string;
  balance: number;
}

interface LineChartProps {
  accounts: Account[];
}

const LineChart = ({ accounts }: LineChartProps) => {
  // Map the accounts data
  const accountNames = accounts.map((account) => account.name);
  const balances = accounts.map((account) => account.balance);

  // Data for the chart
  const data = {
    datasets: [
      {
        label: "Banks",
        data: balances,
        backgroundColor: [
          "grey",
        ],
        borderColor: [
          "blue"
        ],
        borderWidth: 2,
        fill: true,
        
      },

    ],
    labels: accountNames,
  };

  // Chart options with animation
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1000, // Animation duration in milliseconds
      easing: "easeOutQuart" as const, // Easing function
      onProgress: (animation: { currentStep: number; numSteps: number }) => {
        console.log("Animation progress:", animation.currentStep / animation.numSteps);
      },
      onComplete: () => {
        console.log("Done!");
      },
    },
  };

  return <Line data={data} options={options} width={150} height={150}/>;
};

export default LineChart;