import React, { useEffect } from "react";
import Datenschutzerklaerung from "../../_customerData/Datenschutzerklaerung";
import Impressum from "../../_customerData/Impressum";
import Hausordnung from "../../_customerData/Hausordnung";
import Button from "../UtilityComponents/Button";

interface ModalProps {
  id: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ id, onClose }) => {
  // Function to prevent propagation of click events from the modal content
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    document.body.classList.add("disable-scrolling");
    document.documentElement.classList.add("disable-scrolling");

    return () => {
      document.body.classList.remove("disable-scrolling");
      document.documentElement.classList.remove("disable-scrolling");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-70"></div>
      <div
        className="hide-scrollbar flex items-center flex-col relative mx-4 -mb-pz50 md:-mb-pz15 w-vw90 overflow-y-auto rounded-3xl bg-brand-accent-2 p-pz5 shadow-lg md:w-vw60"
        style={{ maxHeight: "80vh" }} // limit height to 80% of the view height
        onClick={stopPropagation}
      >
        <div className="text-brand-colour-light">
          {id === "modal-2-0" ? (
            <Impressum></Impressum>
          ) : id === "modal-2-1" ? (
            <Datenschutzerklaerung />
          ) : (
            <Hausordnung></Hausordnung>
          )}
        </div>
        <Button
          styles="mt-8 w-pz40"
          onClick={onClose}
          text="Schließen"
        ></Button>
      </div>
    </div>
  );
};

export default Modal;
