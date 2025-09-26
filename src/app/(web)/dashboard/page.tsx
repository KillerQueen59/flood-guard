/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DoughnutChart from "@/components/Chart/DoughnutChart";
import CustomSelectField from "@/components/CustomSelectField";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import SelectModal from "./components/SelectModal";
import { useDashboardImpl } from "./useDashboardImpl";

export default function Dashboard() {
  const router = useRouter();
  const {
    pt,
    pts,
    kebun,
    kebuns,
    awlDashboard, // <- Note: changed from 'dashboard' to 'awlDashboard'
    awsDashboard, // <- Note: changed from 'dashboard' to 'awsDashboard'
    showModal,
    loading,
    setShowModal,
    setPt,
    setKebun,
  } = useDashboardImpl();

  console.log("AWL dashboard:", awlDashboard);
  console.log("AWS dashboard:", awsDashboard);

  return (
    <div className="m-4">
      <div className="py-8 px-4 space-x-4 flex h-[112px]">
        <CustomSelectField
          options={pts}
          value={pt}
          onChange={(e: any) => {
            setPt(e);
          }}
          name={"pt"}
          label={"PT"}
          // disabled={loading}
        />
        <CustomSelectField
          options={kebuns}
          value={kebun}
          onChange={(e: any) => {
            setKebun(e);
          }}
          name={"kebun"}
          label={"Kebun"}
          // disabled={loading}
        />
      </div>
      <SelectModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />

      <div className={clsx("z-10 grid grid-cols-12 gap-4 mb-4 p-4", {})}>
        <div className="col-span-4 bg-white">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow">
              <div className="text-gray-500">Loading AWL data...</div>
            </div>
          ) : (
            <DoughnutChart
              title="AWL TMAS (Tinggi Muka Air Saluran)"
              data={awlDashboard} // <- Using AWL-specific data
              below
              noLine
              className="h-full"
              onClick={() => {
                console.log("AWL clicked");
              }}
              subTitle={"Total"}
              onStatusClicked={() => {
                router.push("/sumber/awl");
              }}
              onLaporanHarianClicked={() => {
                setShowModal(true);
              }}
              onLaporanBulananClicked={() => {
                setShowModal(true);
              }}
            />
          )}
        </div>
        <div className="col-span-4">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow">
              <div className="text-gray-500">Loading AWS data...</div>
            </div>
          ) : (
            <DoughnutChart
              title="AWS"
              data={awsDashboard} // <- Using AWS-specific data
              below
              noLine
              className="h-full"
              onClick={() => {
                console.log("AWS clicked");
              }}
              subTitle={"Total"}
              onStatusClicked={() => {
                router.push("/sumber/aws");
              }}
              onLaporanHarianClicked={() => {
                router.push("/device/aws");
              }}
              onLaporanBulananClicked={() => {
                router.push("/device/aws");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
