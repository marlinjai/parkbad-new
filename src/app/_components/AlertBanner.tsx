/* eslint-disable @next/next/no-html-link-for-pages */

export default function AlertBanner({ preview }: { preview?: boolean }) {
  if (!preview) return null;

  return (
    <div className={`border-accent-7 bg-accent-7 border-b text-white`}>
      <div className=" w-screen flex flex-col items-center justify-center">
        <div className="py-2 text-center text-sm">
          {"Previewing draft content. "}
          <a
            href="/api/exit-preview"
            className="hover:text-cyan underline transition-colors duration-200"
          >
            Disable draft mode
          </a>
        </div>
      </div>
    </div>
  );
}
