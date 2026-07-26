import { MdErrorOutline } from "react-icons/md";

interface FormAlertProps {
  message: string;
}

export const FormAlert = ({ message }: FormAlertProps) => (
  <div className="alert alert-error alert-soft w-full" role="alert">
    <MdErrorOutline className="shrink-0" size={20} />
    <span className="text-sm">{message}</span>
  </div>
);
