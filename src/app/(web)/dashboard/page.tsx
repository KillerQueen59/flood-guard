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
    dashboard,
    showModal,
    loading: isLoading,
    setShowModal,
    setPt,
    setKebun,
  } = useDashboardImpl();

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
        />
        <CustomSelectField
          options={kebuns}
          value={kebun}
          onChange={(e: any) => {
            setKebun(e);
          }}
          name={"kebun"}
          label={"Kebun"}
        />
      </div>
      <SelectModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />

      <div className={clsx("z-10 grid grid-cols-12 gap-4 mb-4 p-4", {})}>
        <div className="col-span-4 ">
          <DoughnutChart
            title="AWL TMAS (Tinggi Muka Air Saluran)"
            data={dashboard}
            below
            noLine
            className="h-full"
            onClick={() => {
              console.log("clicked");
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
        </div>
        <div className="col-span-4 ">
          <DoughnutChart
            title="AWS"
            data={dashboard}
            below
            noLine
            className="h-full"
            onClick={() => {
              console.log("clicked");
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
        </div>
      </div>
    </div>
  );
}
