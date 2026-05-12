import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: ReactNode;
}

export default function ModalPortal({ children }: Props) {
  return createPortal(children, document.body);
}
