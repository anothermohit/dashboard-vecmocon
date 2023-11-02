import BrandOne from '../images/brand/brand-01.svg';
import BrandTwo from '../images/brand/brand-02.svg';
import BrandThree from '../images/brand/brand-03.svg';
import BrandFour from '../images/brand/brand-04.svg';
import BrandFive from '../images/brand/brand-05.svg';
import { Link } from 'react-router-dom';

const deviceRegistered = [
  // Client 0
  "V11000860181069506266",
  "abcf213",
  "V11001860181069506100",
  "V11000860181069505375",
  "V11000860987054384091",
  "V11000860181069507942",
  "V11000860181069505367",
  "V11000860181069506241",
  "V11004860987054383952",
  "V11000860181069504600",
  "V11000860181069507884",
  "V14000860057065002346",
  "V14000860057065002759",
  "V14000860057065002155",
  "V14000860057065002148",
  "V14000860057065002171",
  "V14000860057065002387",
  "V14000860181069507942",
  "V14000860057065002353",
  "V14000860057065019274",
  "V11000860181069520911",
  "V11000860181069506183",
  "V11000860181069575253",
  "V11000860181069508627",
  "V11000860181069575329",
  "V11000860181069508320",
  "V11000860181069521836",
  "V11000860181069521018",
  "V11000860181069520994",
  "V11000860181069575196",
  "V11000860181069505268",
  "V11000860181069506134",
  "V11000860181069508288",
  "V11000860181069506274",
  "V11000860181069505383",
  "V11000860181069524996",
  "V11000860181069508254",
  "V11000860181069506209",
  "V11000860181069525019",
  "V11000860181069508270",
  "V11000860181069575303",
  "V11000860181069521786",
  "V11000860181069508130",
  "V11000860181069504840",
  "V11000860181069508452",
  "V11000860181069575295",
  "V11000860181069508502",
  "V11000860181069506068",
  "V11000860181069508163",
  "V11000860181069525027",
  "V11000860181069521794",
  "V11000860181069520986",
  "V11000860181069525084",
  "V11000860181069508619",
  "V11000860181069575246",
  "V11000860181069508593",
  "V14000860057065002627",
  "V15006860181063872664",
  "V14000860057065002395",
  "V15000860181063871740",
  "V15000860181063873332",
  "V15000860181063870965",
  "V15000860181063871369",
  "V1500086018106387158",
  "V15000860181063871260",
  "V15000860181063870320",
  "V1500086081063872623",
  "V1500086081063872680",
  "V1500086081063871153",
  "V1500086081063871096",
  "V1500086081063870825",
  "V15000860181063873225",
  "V15000860181063872623",
  "V15000860181063872680",
  "V15000860181063871153",
  "V15000860181063871096",
  "V15000860181063870825"
]

function replacer(key, value) {
  return value.replace(/"/g, '').toString();
}

const TableOne = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Devices
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Index
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              DeviceId
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              SOC
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Voltage
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Last Active
            </h5>
          </div>
        </div>

      {deviceRegistered.map((deviceId, index) => (
        <div key={index} className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block">{index}</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <Link to={"/device/" + deviceId}>
              <p className="text-black dark:text-white">{deviceId}</p>
            </Link>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$5,768</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">590</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">4.8%</p>
          </div>
        </div>
      ))}

        {/*
        <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              <img src={BrandOne} alt="Brand" />
            </div>
            <p className="hidden text-black dark:text-white sm:block">Google</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">3.5K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$5,768</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">590</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">4.8%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              <img src={BrandTwo} alt="Brand" />
            </div>
            <p className="hidden text-black dark:text-white sm:block">
              Twitter
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">2.2K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$4,635</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">467</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">4.3%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              <img src={BrandThree} alt="Brand" />
            </div>
            <p className="hidden text-black dark:text-white sm:block">Github</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">2.1K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$4,290</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">420</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">3.7%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              <img src={BrandFour} alt="Brand" />
            </div>
            <p className="hidden text-black dark:text-white sm:block">Vimeo</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">1.5K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$3,580</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">389</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">2.5%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5">
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <div className="flex-shrink-0">
              <img src={BrandFive} alt="Brand" />
            </div>
            <p className="hidden text-black dark:text-white sm:block">
              Facebook
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">1.2K</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-meta-3">$2,740</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-black dark:text-white">230</p>
          </div>

          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p className="text-meta-5">1.9%</p>
          </div>
        </div>

  */}
      </div>
    </div>
  );
};

export default TableOne;
