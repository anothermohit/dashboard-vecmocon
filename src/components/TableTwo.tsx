import ProductOne from '../images/product/product-01.png';
import ProductTwo from '../images/product/product-02.png';
import ProductThree from '../images/product/product-03.png';
import ProductFour from '../images/product/product-04.png';

const TableTwo = (args) => { 
  console.log(args);
  let deviceId = '';
  let soc = '';

  try {
    deviceId = args.deviceState.reported.deviceInfo[1];
    soc = args.deviceState.reported.bms.batterySocStack[1];
  } catch (err) {
    
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Device Details
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">DeviceId</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">SOC</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Current</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Last Active</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Misc</p>
        </div>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ProductOne} alt="Product" />
            </div>
            <p className="text-sm text-black dark:text-white">
              {deviceId}
            </p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">{soc}</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">$269</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">22</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-meta-3">$45</p>
        </div>
      </div>
    </div>
  );
};

export default TableTwo;
