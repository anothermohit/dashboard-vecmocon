import { connect } from 'react-redux';
import TableOne from '../../components/TableOne.tsx';
import AWSData from '../../aws.data.jsx';
import MQTT311 from '../../Mqtt311.js';
import DeviceMap from '../../components/DeviceMap.jsx';
import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';

const AllDevices = (props) => {
  const { dataItems, devices } = props; // Collect deviceState from props
  console.log(dataItems, devices);

  return (
    <>
      <AWSData /> {/* clientInfo as dataItems */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
      <br />
      {/*dataItems.length ? <MQTT311 dataItems={dataItems} /> : null*/} {/* real-time state of every device in devices */}
      <DeviceMap devices={devices} /> {/* passing real-time state of all devices */}
      <div className="col-span-12 xl:col-span-8">
        <TableOne style={{marginTop:20, paddingBottom: 20}} devices={devices} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    dataItems: state.data.dataItems,
    devices: state.device.devices, // Modify to get all deviceStates
  };
};

export default connect(mapStateToProps)(AllDevices);