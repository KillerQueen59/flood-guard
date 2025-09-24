import clsx from "clsx";
import Button, { ButtonColor, ButtonSize, ButtonType } from "../Button";
import { dataType } from "@/app/(web)/device/aws/component/RenderData";
import { Bar } from "react-chartjs-2";
import Table from "../Table/Table";
import { useCapture } from "@/hooks/useCapture";

export const TableChart = ({
  upperTitle = "",
  title = "",
  data,
  columns,
  className,
  selectedDate,
  id,
  pt,
  kebun,
  device,
}: {
  upperTitle?: string;
  title?: string;
  data: any;
  columns: any;
  className?: string;
  selectedDate?: string;
  id: string;
  pt: string;
  kebun: string;
  device: string;
}) => {
  const { pictureComponent } = useCapture(id);

  return (
    <div className={clsx("p-6 rounded-2xl w-full flex flex-col", className)}>
      <div className="flex">
        <div className="h6 my-2 flex-grow">{upperTitle}</div>
        <Button
          label="Download Grafik"
          onClick={() => {
            pictureComponent(id, "png");
          }}
          buttonSize={ButtonSize.SMALL}
          buttonColor={ButtonColor.SECONDARY}
          buttonType={ButtonType.OUTLINED}
        />
      </div>
      <div className="p-4" id={id}>
        <div className="flex flex-col space-y-1 my-4">
          <div className="text-sm flex w-full">
            <div className="w-[10%]">PT</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{pt}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Kebun</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{kebun}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Device</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{device}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Tanggal</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{selectedDate ?? "-"}</div>
          </div>
        </div>
        <div className="text-lg text-center">{title}</div>
        <div className="flex-1 my-4 min-h-[400px]">
          <Table
            data={data}
            columns={columns}
            pageIndex={0}
            setPageIndex={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default TableChart;
