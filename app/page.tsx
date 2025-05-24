import Scene from "@/components/Scene";

export default function Home() {
  return (
    <div className="flex w-screen h-screen bg-black overflow-hidden">
      <Scene />
      <div className="absolute w-full h-full inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex relative w-[70%] h-[60%]">
          <div className="absolute text-[9px] w-1/3 md:w-[12vw] top-0 left-0 font-homevideo">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <div className="absolute text-[9px] w-1/3 md:w-[12vw] bottom-0 right-0 text-right font-homevideo">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </div>
      </div>
    </div>
  );
}
