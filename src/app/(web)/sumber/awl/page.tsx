"use client";
import Table from "@/components/Table/Table";
import CustomSelectField from "@/components/CustomSelectField";
import Button, { ButtonSize, ButtonColor } from "@/components/Button";
import AWLColumn from "./components/AWLColumn";
// import { downloadCsvAwl, downloadPdfAwl } from "@/hooks/useExport";
import { useAwlImpl } from "./useAwlImpl";

export default function AWL() {
  const columns = AWLColumn();
  const { awl, loading } = useAwlImpl();

  return (
    <div>
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                AWL Device
              </div>
              <div className="font-medium text-gray-50"></div>
            </div>
            <div className="flex space-x-4"></div>
          </div>
          <div className="text-black">
            <div className="flex border-t px-6 pt-5 pb-2 space-x-6">
              <CustomSelectField
                options={[]}
                value={""}
                onChange={undefined}
                name={"status"}
                label={"Status"}
              />
              <CustomSelectField
                options={[]}
                value={""}
                onChange={undefined}
                name={"tipe"}
                label={"Tipe"}
              />
              <CustomSelectField
                options={[]}
                value={""}
                onChange={undefined}
                name={"region"}
                label={"Region"}
              />
              <div className="flex-grow" />
              <Button
                label="PDF"
                onClick={() => {
                  // downloadPdfAwl(dummyAwl);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
              />
              <Button
                label="Excel"
                onClick={() => {
                  // downloadCsvAwl(dummyAwl);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
              />
            </div>
            <div className="flex px-6 pt-5 pb-2 space-x-6">
              <CustomSelectField
                options={[]}
                value={""}
                onChange={undefined}
                name={"pt"}
                label={"PT"}
              />
              <CustomSelectField
                options={[]}
                value={""}
                onChange={undefined}
                name={"kebun"}
                label={"Kebun"}
              />
            </div>
            <Table
              data={awl}
              columns={columns}
              pageIndex={0}
              setPageIndex={() => {}}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
