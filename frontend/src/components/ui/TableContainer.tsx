interface Props {
  children: React.ReactNode;
}

export default function TableContainer({
  children,
}: Props) {
  return (
    <div
      className="
        w-full
        overflow-x-auto
        scrollbar-thin
        scrollbar-thumb-gray-300
      "
    >
      {children}
    </div>
  );
}