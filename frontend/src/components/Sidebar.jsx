
import React from 'react'

export default function Sidebar () {
  return (
    <div className="sticky top-0 p-4 bg-gray-100 rounded-xl w-full" data-testid="sidebar">
      <ul className="flex sm:flex-col overflow-hidden content-center justify-between">
        <li className="py-2 hover:bg-indigo-300 rounded sidebar-link" data-testid="sidebar-link">
          <a className="truncate" href="/">
            <img alt="dashboard" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/home.svg" className="w-7 sm:mx-2 mx-4 inline" />
            <span className="hidden sm:inline" data-testid="sidebar-link-dashboard">Dashboard</span>
          </a>
        </li>
        <li className="py-2 hover:bg-indigo-300 rounded sidebar-link" data-testid="sidebar-link">
          <a className="truncate" href="/settings">
            <img alt="settings" src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/cog.svg" className="w-7 sm:mx-2 mx-4 inline" /> <span className="hidden sm:inline">Settings</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
