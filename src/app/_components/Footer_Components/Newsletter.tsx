import React from 'react'

const Newsletter = () => {
  return (
<div className="sm:w-pz50  md:grid ">
            <h3 className="text-lg font-semibold leading-6 text-white">
              Aboniere unseren Newsletter
            </h3>
            <p className="text-md mt-2 leading-6 text-gray-300">
              Aktuelle Neuigkeiten, Events und Aktionen im Parkbad Gütersloh
              einmal monatlich per E-Mail
            </p>
            <form className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email Adresse
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder="Deine Email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="text-md flex w-full items-center justify-center rounded-md bg-brand-colour-dark px-3 py-2 font-semibold text-white shadow-sm hover:bg-brand-colour-dark/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Abonieren
                </button>
              </div>
            </form>
          </div>
  )
}

export default Newsletter