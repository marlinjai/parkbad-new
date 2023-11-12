import SvgOverlays from "./SvgOverlays";

export default function VideoSection() {
  return (
    <div className="video-BG  relative mb-pz15 flex min-h-vidbg flex-col  content-center justify-between">
      {/* Video background */}
      <video
        src={"/Header_BG_II_big_webm_bigger.mp4"}
        typeof="video/mp4"
        className="left-0 top-0 max-h-vh90 min-h-vidbg w-vw100 object-cover"
        playsInline
        autoPlay
        loop
        muted
      />
      <div className="  flex justify-center">
        <SvgOverlays level={2}></SvgOverlays>
      </div>
    </div>
  );
}
