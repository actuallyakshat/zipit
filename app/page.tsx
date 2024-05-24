import {
  ArrowRightIcon,
  LockIcon,
  UserIcon,
  WaypointsIcon,
} from "lucide-react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import Modals from "./_components/Modals";
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
    <section className="appbg flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-gray-100 px-4 lg:px-16">
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <div className="">
          <span className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/30 px-4 py-2 font-mono text-sm font-medium backdrop-blur-sm">
            It&apos;s completely free!
          </span>
          <h1 className="mt-2 max-w-xl text-center text-5xl font-extrabold leading-none tracking-tight text-blue-950 lg:text-6xl">
            <span className="text-primary">Share files</span> without losing
            quality
          </h1>
        </div>

        <h5 className="text-md mb-3 mt-5 max-w-xl text-center font-normal text-gray-500 lg:text-xl">
          Zipit allows you to seamlessly share files from any device. It&apos;s
          a super convenient way to transfer files between devices with zero
          signups and zero compromise on the quality.
        </h5>
        <Modals />
      </div>
      <Footer />
    </section>
  );
}
