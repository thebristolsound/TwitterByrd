import * as React from 'react';

export default function Index() {

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
        <div className="sm:w-1/3 md:1/4 w-full flex-shrink flex-grow-0 p-4">
          <div className="sticky top-0 p-4 bg-gray-100 rounded-xl w-full">
            <ul className="flex sm:flex-col overflow-hidden content-center justify-between">
              <li className="py-2 hover:bg-indigo-300 rounded">
                <a className="truncate" href="/">
                  <img alt="dashboard" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/home.svg" className="w-7 sm:mx-2 mx-4 inline" />
                  <span className="hidden sm:inline">Dashboard</span>
                </a>
              </li>
              <li className="py-2 hover:bg-indigo-300 rounded">
                <a className="truncate" href="/settings">
                  <img alt="settings" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/cog.svg" className="w-7 sm:mx-2 mx-4 inline" /> <span className="hidden sm:inline">Settings</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl border my-3 w-full">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block text-indigo-600 overflow-ellipsis">Made with Tailwind CSS!</span>
              </h2>
            </div>
          </div>
        </div>
        <main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
          <h1 className="text-3xl md:text-5xl mb-4 font-extrabold" id="home">Single-page App Layout</h1>

        </main>
      </div>
      <footer className="bg-indigo-800 mt-auto">
        <div className="px-4 py-3 text-white mx-auto">
          <h1 className="text-2xl hidden sm:block mb-2">Footer</h1>
          <div className="flex">
            <div className="flex-grow flex flex-col">
              <a href="#" className="text-xs uppercase tracking-wider">Product</a>
              <a href="#" className="text-xs uppercase tracking-wider">Services</a>
              <a href="#" className="text-xs uppercase tracking-wider">Team</a>
              <a href="#" className="text-xs uppercase tracking-wider">More...</a>
            </div>
            <div className="flex-grow flex flex-col">
              <a href="#" className="text-xs uppercase tracking-wider">Contact</a>
              <a href="#" className="text-xs uppercase tracking-wider">About</a>
              <a href="#" className="text-xs uppercase tracking-wider">Careers</a>
              <a href="#" className="text-xs uppercase tracking-wider">Affiliates</a>
            </div>
            <div className="flex-grow flex flex-col">
              <a href="#" className="text-xs uppercase tracking-wider">Facebook</a>
              <a href="#" className="text-xs uppercase tracking-wider">Instagram</a>
              <a href="http://in1.com" className="text-xs uppercase tracking-wider">In1.com</a>
              <a href="#" className="text-xs uppercase tracking-wider">Twitter</a>
            </div>
            <div className="flex-grow flex flex-col">
              <a href="#" className="text-xs uppercase tracking-wider">FAQ's</a>
              <a href="#" className="text-xs uppercase tracking-wider">Open</a>
              <a href="#" className="text-xs uppercase tracking-wider">Launch Up</a>
              <a href="#" className="text-xs uppercase tracking-wider">Get Started</a>
            </div>
          </div>
          <div className="text-right text-xs py-2">
            <a href="">&copy;2021 Iatek</a>
          </div>
        </div>
      </footer>
    </>
  )
}
