import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CardFour from './CardFour.tsx';
import CardOne from './CardOne.tsx';
import CardThree from './CardThree.tsx';
import CardTwo from './CardTwo.tsx';
import ChartOne from './ChartOne.tsx';
import ChartThree from './ChartThree.tsx';
import ChartTwo from './ChartTwo.tsx';
import ChartFive from './ChartFive.tsx';
import ChartSix from './ChartSix.tsx';
import ChartSeven from './ChartSeven.tsx';
import DeviceData from '../device.data.jsx';

function addShadowToData(seriesData, seriesShadow) {
  const timestamp = seriesShadow.timestamp;

  // Check if the timestamp already exists in seriesData
  const exists = seriesData.some((data) => data.timestamp === timestamp);

  if (!exists) {
    // Add the seriesShadow data to seriesData
    seriesData.push(seriesShadow);
  }

  return seriesData;
}

const DeviceDetails = ({ series }) => {
  // Use the useParams hook to access route parameters
  const { deviceId } = useParams();
  if (series.seriesShadow) addShadowToData(series.seriesData, series.seriesShadow);
  console.log(series);

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Hour'); // Default to 'Hour'

  const timePeriods = {
    Hour: 'Hour',
    Day: 'Day',
    Week: 'Week',
    Month: 'Month',
  };

  console.log(selectedTimePeriod);

  return (
    <div>
      <div className="flex w-full justify-end">
        <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark-bg-meta-4" style={{ overflow: 'hidden' }}>
          {Object.keys(timePeriods).map((period) => (
            <button
              key={timePeriods[period]}
              className={`rounded py-1 px-3 text-xs font-medium text-black hover-bg-white hover-shadow-card dark-bg-boxdark dark-text-white dark-hover-bg-boxdark ${selectedTimePeriod === timePeriods[period] ? 'bg-white shadow-card' : ''}`}
              onClick={() => setSelectedTimePeriod(timePeriods[period])}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <DeviceData deviceId={deviceId} time={selectedTimePeriod} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {series.seriesData.length ? <ChartOne initialData={series.seriesData} /> : null}
        {series.seriesData.length ? <ChartFive initialData={series.seriesData || []} /> : null}
        {series.seriesData.length ? <ChartSix initialData={series.seriesData || []} /> : null}
        {series.seriesData.length ? <ChartSeven initialData={series.seriesData || []} /> : null}
        <ChartTwo />
        <ChartThree />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    series: state.series,
  };
};

export default connect(mapStateToProps)(DeviceDetails);
