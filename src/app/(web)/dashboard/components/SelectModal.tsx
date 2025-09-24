import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { useRouter } from "next/navigation";

const SelectModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();

  return (
    show && (
      <div
        className="z-10 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center "
        onClick={() => {
          onClose();
        }}>
        <div className="flex p-4 space-x-4 bg-white h-20 align-center justify-center w-[20%] rounded-lg ">
          <Button
            label="TMAS"
            onClick={() => {
              router.push("/device/tmas");
            }}
            buttonSize={ButtonSize.LARGE}
            buttonColor={ButtonColor.PRIMARY}
          />
          <Button
            label="TMAT"
            onClick={() => {
              router.push("/device/tmat");
            }}
            buttonSize={ButtonSize.LARGE}
            buttonColor={ButtonColor.PRIMARY}
          />
        </div>
      </div>
    )
  );
};

export default SelectModal;
