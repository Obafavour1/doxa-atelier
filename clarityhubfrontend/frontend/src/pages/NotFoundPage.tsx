// import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className=" text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="w-3/6 relative mx-auto mt-20 text-center">
        <h3 className="text-3xl">Page Not found</h3>
        <a href="/" className="text-rose-300 ">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
