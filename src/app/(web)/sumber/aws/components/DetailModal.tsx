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
        className="z-10 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center "
        onClick={() => {
          // on/Close();
        }}
      >
        <div className="flex flex-col w-[80%] bg-white rounded-lg max-h-[90%] min-h-[200px]">
          <div>
            <div className="flex items-center space-x-4 pb-4 p-6">
              <div className="flex-grow ">
                <div className="text-gray-80 text-base font-semibold">
                  Dashboard Detail
                </div>
              </div>
              <div className="flex space-x-4">
                <Button
                  label="Export Pdf "
                  onClick={() => {
                    captureComponent("dummy-id");
                  }}
                  buttonSize={ButtonSize.LARGE}
                  buttonColor={ButtonColor.PRIMARY}
                />
                <button
                  className="text-primary-60"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            <div className="border-b border-gray-30 mt-4"></div>
          </div>
          {/* Body */}
          <div className="relative p-8 overflow-y-auto space-y-6" id="dummy-id">
            <div>
              <div className="flex space-x-4">
                <div className="min-w-[100px]">Device AWS</div>
                <div>:</div>
                <div>AWS-001-THP8-3209</div>
              </div>
              <div className="flex space-x-4">
                <div className="min-w-[100px]">Last Updated</div>
                <div>:</div>
                <div>2024-09-19 06:00:00</div>
              </div>
            </div>
            <div className="flex w-full space-x-4 ">
              <div className="max-w-[30%] w-[30%] space-y-2">
                {/* Device Condition */}
                <div className="bg-white min-h-[100px] rounded border border-primary-60">
                  <div className=" w-full bg-primary-60 flex align-center p-2 py-auto text-white">
                    Device Condition
                  </div>
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <div>Battery</div>
                      <div className="w-full">
                        <div className="flex border border-black w-full min-h-[50px] relative">
                          <div
                            className="min-h-[50px]"
                            style={{
                              width: `${dummyBattery}%`,
                              background:
                                dummyBattery > 50 ? "#10B981" : "#EF4444",
                            }}
                          />
                          <div className="text-white absolute flex p-4 h-[50px]">
                            {dummyBattery} %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <div>Signal</div>
                      <div className="w-full flex ">
                        <div className="flex min-h-[50px] relative">
                          <img
                            src="/signal.png"
                            alt="signal"
                            width={80}
                            height={80}
                          />
                          <div className="absolute bottom-0 right-0">31</div>
                        </div>
                        <div className="flex-grow"></div>
                        <div>Sangat Kuat</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Wind Condition */}
                <div className="bg-white min-h-[100px] rounded border border-primary-60">
                  <div className=" w-full bg-primary-60 flex align-center p-2 py-auto text-white">
                    Wind Condition
                  </div>
                  <div className="flex">
                    <div className="p-4 w-[50%]">
                      <div className="space-x-2">
                        <div>Arah angin</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/compass.png"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                        </div>
                        <div className="  h-fit w-full  cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                          <div>56o</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 w-[50%]">
                      <div className="space-x-2">
                        <div>Kecepatan Angin</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative py-2">
                            <img
                              src="/windspeed.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="  h-fit w-full cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>56o 0 km/jam</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-[35%] w-[35%] space-y-2">
                <div className="bg-white min-h-[100px] rounded border border-primary-60 overflow-auto">
                  <div className=" w-full bg-primary-60 flex align-center p-2 py-auto text-white">
                    Rainfall Condition
                  </div>
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <div className="w-full flex flex-col  min-h-[150px]">
                        <div className="flex max-h-[100px] relative">
                          <img
                            src="/raincloud.gif"
                            alt="signal"
                            width={110}
                            height={110}
                          />
                        </div>
                        <div className="w-full p-4">
                          <div className="flex border border-black w-full min-h-[150px] relative">
                            <div className="flex flex-col w-1/3 h-[150px] border-r border-black">
                              <div className=" border-b h-fit bg-primary-60 text-white border-black w-full text-center ,b-4">
                                Hari ini
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Curah Hujan (CH)</div>
                                <div>18 mm </div>
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Intensitas (I)</div>
                                <div>2 mm/jam</div>
                              </div>
                            </div>
                            <div className="flex flex-col w-1/3 h-[150px] border-r border-black">
                              <div className=" border-b h-fit bg-primary-60 text-white border-black w-full text-center ,b-4">
                                Kemarin
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Curah Hujan (CH)</div>
                                <div>18 mm </div>
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Intensitas (I)</div>
                                <div>2 mm/jam</div>
                              </div>
                            </div>
                            <div className="flex flex-col w-1/3 h-[150px] border- border-black">
                              <div className=" border-b h-fit bg-primary-60 text-white border-black w-full text-center ,b-4">
                                Bulan Ini
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Curah Hujan (CH)</div>
                                <div>18 mm </div>
                              </div>
                              <div className="  h-fit w-full text-center cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                                <div>Intensitas (I)</div>
                                <div>2 mm/jam</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white min-h-[100px] rounded border border-primary-60">
                  <div className=" w-full bg-primary-60 flex align-center p-2 py-auto text-white overflow-auto">
                    Derivative Data
                  </div>
                  <div className="p-4 w-[50%]">
                    <div className="space-x-2">
                      <div>Evapotranspirasi</div>
                      <div className="w-full">
                        <div className="flex min-h-[50px] relative">
                          <img
                            src="/evapotranspiration.gif"
                            alt="signal"
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className="flex-grow"></div>
                        <div className="h-fit w-fit px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                          <div>Σ Bulanan : 0.30 mm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-[35%] w-[35%] space-y-2 ">
                <div className="bg-white min-h-[100px] rounded border border-primary-60 overflow-auto">
                  <div className=" w-full bg-primary-60 flex align-center p-2 py-auto text-white">
                    Ambient Air Condition
                  </div>
                  <div className="flex">
                    <div className="p-4 w-1/3">
                      <div className="space-x-2">
                        <div className="text-center">Suhu</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/temperature.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="h-fit w-full px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>24.00o</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 w-1/3">
                      <div className="space-x-2">
                        <div className="text-center">Barometer</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/barometer.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="h-fit w-full px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>1014.10 hPa</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 w-1/3">
                      <div className="space-x-2">
                        <div className="text-center">Radiasi</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/radiation.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="h-fit w-full px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>0.00 W/m2</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="p-4 w-1/3">
                      <div className="space-x-2">
                        <div className="text-center"> Kelembapan</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/humidity.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="h-fit w-full text-center px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>93 %</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 w-1/3">
                      <div className="space-x-2">
                        <div className="text-center">UV Index</div>
                        <div className="w-full">
                          <div className="flex min-h-[50px] relative">
                            <img
                              src="/uvindex.gif"
                              alt="signal"
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="flex-grow"></div>
                          <div className="h-fit w-full text-center px-2 cursor-pointer bg-primary-10 py-1 hover:bg-primary-40">
                            <div>0.0</div>
                            <div>Aman</div>
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
      </div>
    )
  );
};

export default DetailModal;
