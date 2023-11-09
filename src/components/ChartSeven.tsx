import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE', '#FF5733', '#00BCD4'], // Add colors for the other two data series
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
    toolbar: {
      show: false,
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
      }
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
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      type: 'datetime',
      categories: [], // Initialize with an empty array
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
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 0,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
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
  },
  yaxis: [
    {
      title: {
        text: 'Temperature',
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 100,
    },
    {
      title: {
        text: 'Voltage (V)',
        style: {
          fontSize: '0px',
        },
      },
      min: -50,
      max: 50,
    },
    {
      title: {
        text: 'Speed',
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 100,
    },
    {
      title: {
        text: 'Distance',
        style: {
          fontSize: '0px',
        },
      },
      min: 0, // Set the appropriate min and max values for the "distance" curve
      max: 100,
    }
  ],
};

interface ChartSevenProps {
  initialData: {
    iot: {
      temperature: number;
      voltage: number;
      speed: number;
      distance: number;
    }
    timestamp: number;
  }[];
}

const ChartSeven: React.FC<ChartSevenProps> = ({ initialData }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const ISTOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
    return date.toLocaleString(undefined, ISTOptions);
  };

  let chartData = {
    series: [
      {
        name: 'Temperature',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.iot.temperature]),
      },
      {
        name: 'Voltage',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.iot.voltage]),
      },
      {
        name: 'Speed',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.iot.speed]),
      },
      {
        name: 'Distance',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.iot.distance]),
      },
    ],
  }
 // options.xaxis.categories = initialData.map((dataPoint) => formatDate(dataPoint.timestamp));


  return (
<div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark-bg-boxdark xl-col-span-4">
  <div className="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h5 className="text-xl font-semibold text-black dark:text-white">
          IOT DATA
        </h5>
      </div>
  </div>
  <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
    <div className="flex w-full">
      <div style={{width: 130}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
          <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
        </span>
        <div className="w-full">
          <p className="font-semibold text-primary">Temperature</p>
          <p className="text-sm font-medium">(°C)</p>
        </div>
      </div>
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
          <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
        </span>
        <div className="w-full">
          <p className="font-semibold text-secondary">Voltage</p>
          <p className="text-sm font-medium">(V)</p>
        </div>
      </div>
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-tertiary">
          <span style={{background: options.colors[2]}} className="bg-black block h-2.5 w-full max-w-2.5 rounded-full bg-tertiary"></span>
        </span>
        <div style={{color: options.colors[2]}} className="w-full">
          <p className="font-semibold text-tertiary">Speed</p>
          <p className="text-sm font-medium">(Km/hr)</p>
        </div>
      </div>
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-tertiary">
          <span style={{background: options.colors[3]}} className="bg-black block h-2.5 w-full max-w-2.5 rounded-full bg-tertiary"></span>
        </span>
        <div style={{color: options.colors[3]}} className="w-full">
          <p className="font-semibold text-tertiary">Distance</p>
          <p className="text-sm font-medium">(Km)</p>
        </div>
      </div>      
    </div>
  </div>
  <div>
    <div id="ChartSeven" className="-ml-5">
      <ReactApexChart options={options} series={chartData.series} type="area" height={350} />
    </div>
  </div>
</div>

  );
};


export default ChartSeven;
