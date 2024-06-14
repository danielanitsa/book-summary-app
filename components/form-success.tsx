import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex justify-center w-full text-center mx-auto items-center gap-x-2 text-sm text-emerald-500">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
