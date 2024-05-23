import { Button } from "@radix-ui/themes";
import { LockIcon, UserIcon, WaypointsIcon } from "lucide-react";
import Image from "next/image";
const features = [
  {
    id: 1,
    title: "Free and Open Source",
    icon: <WaypointsIcon />,
    description:
      "Zipit is completely free and open source. You can use it for free and contribute to the project.",
  },
  {
    id: 2,
    title: "No Account Required",
    icon: <UserIcon />,
    description:
      "Zipit doesn't require any signups. You can create a room and share it with anyone.",
  },
  {
    id: 3,
    title: "Secure",
    icon: <LockIcon />,
    description:
      "No file is saved beyond the lifetime of a room, so you don't have to worry about your files being spread around the internet.",
  },
];

export default function Home() {
  return (
    <section className="bg-gray-100 w-full h-full min-h-screen gap-8 px-16">
      <nav className="h-16 border-b fixed w-full left-0 flex items-center justify-center">
        <Button variant="surface">Create Room</Button>
      </nav>
      <div className="w-full grid grid-cols-2 pt-36">
        <div className="flex flex-col justify-center col-span-1">
          <div className="pr-4 pl-2 py-1 w-fit hover:bg-gray-300 transition-colors bg-gray-200 text-sm font-medium rounded-full flex gap-3">
            <span className="bg-primary py-1 h-full px-4 rounded-full text-sm text-white">
              Guess what?
            </span>
            <p className="my-auto">It&apos;s Completely Free!</p>
          </div>
          <div className="mt-3">
            <h1 className="font-extrabold text-blue-950 text-6xl max-w-3xl tracking-tight leading-none">
              Share files without loosing quality
            </h1>
          </div>

          <h5 className="mt-3 text-xl font-normal text-gray-500 max-w-screen-md">
            Zipit allows you to seamlesslly upload and download files from any
            device. It&apos;s a super convenient way to transfer files between
            devices with zero signups
          </h5>
          <div className="mt-3">
            <Button variant="soft" size={"3"}>
              Create Room
            </Button>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <Image
            src={"/dummy.png"}
            width={1920}
            height={1080}
            alt="Dummy"
            className="shadow-xl rounded-xl aspect-video"
          />
        </div>
      </div>
      <div className="mt-20 pb-8 grid grid-cols-3 gap-3">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl flex items-center gap-2 font-bold text-blue-950">
                {feature.icon} {feature.title}
              </h3>
              <p className="text-md pr-6 font-medium text-gray-500">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
