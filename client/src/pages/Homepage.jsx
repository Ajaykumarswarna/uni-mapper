import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useData } from "../context/DAta";

const Homepage = () => {
  const { data } = useData();
  const { theme } = useContext(ThemeContext);
  


  const buttonStyle = theme === "dark"
    ? "bg-blue-600 text-white"
    : theme === "solarized"
    ? "bg-yellow-600 text-black"
    : theme === "high-contrast"
    ? "bg-[#ffcc00] text-white"
    : "bg-blue-400 text-white";

  const textStyle = theme === "dark"
    ? "text-gray-200"
    : theme === "solarized"
    ? "text-gray-900"
    : theme === "high-contrast"
    ? "text-gray-100"
    : "";

  return (
    <div className={` min-h-screen`}>
      <section className=" ">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className={`bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold ${textStyle} sm:text-7xl`}>
              UniMapper: Transforming
              
                Thoughts into Structured Visuals.
            </h1>

            <p className={`mx-auto mt-4 max-w-xl sm:text-xl/relaxed ${textStyle}`}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
              illo tenetur fuga ducimus numquam ea!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {data.token ? (
                <Link
                  to={"/notes"}
                  className={`block w-full rounded border  px-12 py-3 text-sm font-medium ${buttonStyle}   focus:outline-none focus:ring active:text-opacity-75 sm:w-auto`}
                >
                  Notes
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block w-full rounded border  px-12 py-3 text-sm font-medium ${buttonStyle} focus:outline-none focus:ring active:text-opacity-75 sm:w-auto`}
                  >
                    Login
                  </Link>
                </>
              )}

              <a
                className={`block w-full rounded border  px-12 py-3 text-sm font-medium ${buttonStyle} focus:outline-none focus:ring  sm:w-auto`}
                href="#features"
              >
                Features
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-12 lg:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center xl:max-w-2xl">
            <h2 className={`text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl mb-6 ${textStyle}`}>
              Unimapper Features
            </h2>
            <p className={`mb-4 ${textStyle}`}>
              We are creating a tool that helps you be more productive and efficient when building
              websites and webapps
            </p>
          </div>
          <div className="grid max-w-4xl lg:max-w-6xl grid-cols-1 mx-auto mt-8 text-center gap-y-4 sm:gap-x-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12 lg:mt-20 sm:text-left">
            <div className="relative">
              <div className="absolute -inset-1"></div>
              <div className="relative overflow-hidden bg-white shadow-md rounded-xl h-full">
                <div className="p-9">
                  <h3 className={`mt-6 text-2xl font-bold text-black sm:mt-10`}>
                    Flowchart integration
                  </h3>
                  <p className={`mt-6 text-base text-black`}>
                    Collaborate in realtime with other editors in a project. See what other editors are doing and edit even a simple text together
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden bg-white shadow-md rounded-xl">
              <div className="p-9">
                <h3 className={`mt-6 text-2xl font-bold text-black sm:mt-10`}>
                  Hotkey support
                </h3>
                <p className={`mt-6 text-base text-black`}>
                  Go back and forth your history of changes and restore your designs to any point in time
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1"></div>
              <div className="relative overflow-hidden bg-white shadow-md rounded-xl h-full">
                <div className="p-9">
                  <h3 className={`mt-6 text-2xl font-bold text-black sm:mt-10`}>
                    Multiple themes
                  </h3>
                  <p className={`mt-6 text-base text-black`}>
                    Step up your designs and workflow with integrations with your favourite tools such as mailchimp, slack, jira etc
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Homepage;
