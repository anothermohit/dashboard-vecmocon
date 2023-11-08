import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: [
    '#3C50E0',
    '#80CAEE',
    '#FF5733',
    '#45B849',
    '#FFC733',
    '#E64A19',
    '#00BCD4',
    '#FFA000',
    '#FF5733',
    '#45B849',
    '#FFC733',
    '#E64A19',
    '#00BCD4',
    '#FFA000',
    '#FF5733',
    '#45B849',
  ],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    xaxis: {
      type: 'datetime',
      categories: [], // Initialize with an empty array
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        datetimeUTC: true
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    grid: {
      xaxis: {
        type: 'datetime',
        categories: [],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: Array(16).fill('#3056D3'),
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 4000,
    },
    toolbar: {show: false}
  },
  plotOptions: {
    area: {
      dataLabels: {
        enabled: false, // Disable data labels for area charts
      },
    },
  },
  dataLabels: {
    enabled: false
  }
};

// ... Rest of the code remains the same

interface ChartFiveProps {
  initialData: {
    soc: number;
    voltage: number;
    current: number;
    cellVoltages: number[];
    timestamp: number;
  }[];
}

const ChartFive: React.FC<ChartFiveProps> = ({ initialData }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const ISTOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
    return date.toLocaleString(undefined, ISTOptions);
  };

  const chartData = {
    series: initialData[0].cellVoltages.slice(1).map((_, index) => ({
      name: `Cell-${index + 1}`,
      data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.cellVoltages[index + 1]]), // Skip the first element
    })),
  };  

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark-bg-boxdark xl-col-span-4">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        {chartData.series.map((series, index) => (
          <div style={{ width: 50 }} className="flex" key={index}>
            <span style={{color: options.colors[index]}} className={`mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary`}>
              <span style={{background: options.colors[index]}} className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p style={{fontSize: 10, width: 30, color: options.colors[index]}} className="font-semibold text-primary">{series.name}</p>
              {/*<p className="text-sm font-medium">V</p>*/}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div id="ChartFive" className="-ml-5">
          <ReactApexChart options={options} series={chartData.series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartFive;
