import Image from 'next/image';

export const BusinessName = () => {
  return (
    <div className="flex gap-8 items-center ">
      <Image
        src="/logo.png"
        alt="logo"
        width={80}
        height={80}
        className="rounded-full p-1 bg-gray-200"
      />
      <p className="text-gray-200 font-bold text-2xl">
        Inversiones Jeicar, C.A.
      </p>
    </div>
  );
};
