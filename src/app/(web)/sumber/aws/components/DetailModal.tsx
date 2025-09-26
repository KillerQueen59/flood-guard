import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { useCapture } from "@/hooks/useCapture";

type DetailModalProps = {
  header: string;
  subHeader: string;
  show: boolean;
  onClose: () => void;
};

const DetailModal = ({ show = false, onClose }: DetailModalProps) => {
  const { captureComponent } = useCapture("dummy-id");
  const dummyBattery = 60;

  return (
    show && (
      <div
        className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}>
        <div className="flex flex-col w-[95%] max-w-7xl bg-white rounded-2xl max-h-[95%] min-h-[600px] shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-gray-200">
            <div className="flex items-center justify-between p-6">
              <div className="flex-grow">
                <h2 className="text-gray-800 text-xl font-bold">
                  Dashboard Detail
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Real-time environmental monitoring data
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  label="Export PDF"
                  onClick={() => captureComponent("dummy-id")}
                  buttonSize={ButtonSize.LARGE}
                  buttonColor={ButtonColor.PRIMARY}
                />
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={onClose}>
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">Device AWS:</span>
                <span className="text-gray-800 font-mono bg-white px-3 py-1 rounded-md border">
                  AWS-001-THP8-3209
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">Last Updated:</span>
                <span className="text-gray-800 font-mono bg-white px-3 py-1 rounded-md border">
                  2025-09-25 06:00:00
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto" id="dummy-id">
            <div className="space-y-6">
              {/* First Row - Device Condition, Wind Condition, Derivative Data */}
              <div className="grid grid-cols-3 gap-6">
                {/* Device Condition Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
                    <h3 className="font-semibold text-lg">Device Condition</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Battery */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700 font-medium">
                          Battery
                        </span>
                        <span className="text-sm text-gray-500">
                          {dummyBattery}%
                        </span>
                      </div>
                      <div className="relative bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${dummyBattery}%`,
                            background:
                              dummyBattery > 50
                                ? "linear-gradient(to right, #10B981, #059669)"
                                : "linear-gradient(to right, #EF4444, #DC2626)",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                          {dummyBattery}%
                        </div>
                      </div>
                    </div>

                    {/* Signal */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-700 font-medium">
                          Signal Strength
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          Very Strong
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src="/signal.png"
                          alt="signal"
                          width={60}
                          height={60}
                          className="opacity-80"
                        />
                        <div className="flex-1">
                          <div className="text-2xl font-bold text-gray-800">
                            31
                          </div>
                          <div className="text-sm text-gray-500">dBm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wind Condition Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
                    <h3 className="font-semibold text-lg">Wind Condition</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Wind Direction */}
                      <div className="text-center">
                        <h4 className="text-gray-700 font-medium mb-3">
                          Wind Direction
                        </h4>
                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src="/compass.png"
                            alt="compass"
                            width={70}
                            height={70}
                          />
                          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                            56°
                          </div>
                        </div>
                      </div>

                      {/* Wind Speed */}
                      <div className="text-center">
                        <h4 className="text-gray-700 font-medium mb-3">
                          Wind Speed
                        </h4>
                        <div className="flex flex-col items-center space-y-3">
                          <img
                            src="/windspeed.gif"
                            alt="wind speed"
                            width={70}
                            height={70}
                          />
                          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                            0 km/h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Derivative Data Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
                    <h3 className="font-semibold text-lg">Derivative Data</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center">
                      <h4 className="text-gray-700 font-medium mb-4">
                        Evapotranspiration
                      </h4>
                      <div className="flex flex-col items-center space-y-4">
                        <img
                          src="/evapotranspiration.gif"
                          alt="evapotranspiration"
                          width={80}
                          height={80}
                        />
                        <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg">
                          <div className="font-semibold">Monthly Total</div>
                          <div className="text-lg font-bold">0.30 mm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row - Rainfall Condition (Full Width) */}
              <div className="w-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                      Rainfall Condition
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-center space-x-8">
                      {/* Rain Cloud Image */}
                      <div className="flex-shrink-0">
                        <img
                          src="/raincloud.gif"
                          alt="rain cloud"
                          width={120}
                          height={120}
                        />
                      </div>

                      {/* Rainfall Data Table */}
                      <div className="flex-1 max-w-2xl">
                        <div className="grid grid-cols-3 gap-0 border border-gray-300 rounded-lg overflow-hidden">
                          {/* Today */}
                          <div className="text-center">
                            <div className="bg-blue-600 text-white p-4 font-medium">
                              Today
                            </div>
                            <div className="p-6 bg-blue-50 space-y-3">
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Rainfall (CH)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  18 mm
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Intensity (I)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  2 mm/h
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Yesterday */}
                          <div className="text-center border-l border-gray-300">
                            <div className="bg-blue-600 text-white p-4 font-medium">
                              Yesterday
                            </div>
                            <div className="p-6 bg-blue-50 space-y-3">
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Rainfall (CH)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  18 mm
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Intensity (I)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  2 mm/h
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* This Month */}
                          <div className="text-center border-l border-gray-300">
                            <div className="bg-blue-600 text-white p-4 font-medium">
                              This Month
                            </div>
                            <div className="p-6 bg-blue-50 space-y-3">
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Rainfall (CH)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  18 mm
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">
                                  Intensity (I)
                                </div>
                                <div className="text-xl font-bold text-gray-800">
                                  2 mm/h
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Row - Ambient Air Condition (Full Width) */}
              <div className="w-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                      Ambient Air Condition
                    </h3>
                  </div>
                  <div className="p-6">
                    {/* All metrics in one row */}
                    <div className="grid grid-cols-5 gap-6">
                      {/* Temperature */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-gray-600 text-sm font-medium mb-3">
                          Temperature
                        </h4>
                        <img
                          src="/temperature.gif"
                          alt="temperature"
                          width={60}
                          height={60}
                          className="mx-auto mb-3"
                        />
                        <div className="text-xl font-bold text-gray-800">
                          24.00°C
                        </div>
                      </div>

                      {/* Barometer */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-gray-600 text-sm font-medium mb-3">
                          Pressure
                        </h4>
                        <img
                          src="/barometer.gif"
                          alt="barometer"
                          width={60}
                          height={60}
                          className="mx-auto mb-3"
                        />
                        <div className="text-xl font-bold text-gray-800">
                          1014.10 hPa
                        </div>
                      </div>

                      {/* Radiation */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-gray-600 text-sm font-medium mb-3">
                          Solar Radiation
                        </h4>
                        <img
                          src="/radiation.gif"
                          alt="radiation"
                          width={60}
                          height={60}
                          className="mx-auto mb-3"
                        />
                        <div className="text-xl font-bold text-gray-800">
                          0.00 W/m²
                        </div>
                      </div>

                      {/* Humidity */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-gray-600 text-sm font-medium mb-3">
                          Humidity
                        </h4>
                        <img
                          src="/humidity.gif"
                          alt="humidity"
                          width={60}
                          height={60}
                          className="mx-auto mb-3"
                        />
                        <div className="text-xl font-bold text-gray-800">
                          93%
                        </div>
                      </div>

                      {/* UV Index */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-gray-600 text-sm font-medium mb-3">
                          UV Index
                        </h4>
                        <img
                          src="/uvindex.gif"
                          alt="uv index"
                          width={60}
                          height={60}
                          className="mx-auto mb-3"
                        />
                        <div className="text-xl font-bold text-gray-800">
                          0.0
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Safe
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DetailModal;
