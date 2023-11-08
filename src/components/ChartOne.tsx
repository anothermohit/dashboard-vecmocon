import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
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
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

interface ChartOneProps {
  initialData: {
    soc: number;
    voltage: number;
    current: number;
    timestamp: number;
  }[];
}

const ChartOne: React.FC<ChartOneProps> = ({ initialData }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const ISTOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
    return date.toLocaleString(undefined, ISTOptions);
  };

  let chartData = {
    series: [
      {
        name: 'SOC',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.soc]),
      },
      {
        name: 'Voltage',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.voltage]),
      },
      {
        name: 'Current',
        data: initialData.map((dataPoint) => [dataPoint.timestamp, dataPoint.current]),
      },
    ],
  }
 // options.xaxis.categories = initialData.map((dataPoint) => formatDate(dataPoint.timestamp));


  return (
<div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark-bg-boxdark xl-col-span-4">
  <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
    <div className="flex w-full">
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
          <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
        </span>
        <div className="w-full">
          <p className="font-semibold text-primary">SOC</p>
          <p className="text-sm font-medium">%</p>
        </div>
      </div>
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
          <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
        </span>
        <div className="w-full">
          <p className="font-semibold text-secondary">Voltage</p>
          <p className="text-sm font-medium">V</p>
        </div>
      </div>
      <div style={{width: 100}} className="flex">
        <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-tertiary">
          <span className="bg-black block h-2.5 w-full max-w-2.5 rounded-full bg-tertiary"></span>
        </span>
        <div className="w-full">
          <p className="font-semibold text-tertiary">Current</p>
          <p className="text-sm font-medium">A</p>
        </div>
      </div>
    </div>
    <div className="flex w-full max-w-45 justify-end">
      <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark-bg-meta-4" style={{ overflow: 'hidden' }}>
        <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover-bg-white hover-shadow-card dark-bg-boxdark dark-text-white dark-hover-bg-boxdark">
          Day
        </button>
        <button className="rounded py-1 px-3 text-xs font-medium text-black hover-bg-white hover-shadow-card dark-text-white dark-hover-bg-boxdark">
          Week
        </button>
        <button className="rounded py-1 px-3 text-xs font-medium text-black hover-bg-white hover-shadow-card dark-text-white dark-hover-bg-boxdark">
          Month
        </button>
      </div>
    </div>
  </div>
  <div>
    <div id="chartOne" className="-ml-5">
      <ReactApexChart options={options} series={chartData.series} type="area" height={350} />
    </div>
  </div>
</div>

  );
};


export default ChartOne;
