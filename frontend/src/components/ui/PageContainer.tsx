interface Props {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: Props) {
  return (
    <div
      className="
        w-full
        max-w-[1700px]
        mx-auto

        space-y-5

        overflow-x-hidden
      "
    >
      {children}
    </div>
  );
}