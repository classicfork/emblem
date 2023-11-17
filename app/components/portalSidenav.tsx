import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { NavLink } from "@remix-run/react";

export default function PortalSidenav() {
  return (
    <nav className="fixed pt-6 h-screen border-r-2 shadow-md">
      <ol>
        <li className="py-2">
          <NavLink
            to={`/portal/home`}
            className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
            <label className="hover:cursor-pointer"><AccountBalanceIcon className="flex align-text-bottom" fontSize="small" /> Memorials</label></NavLink>
        </li>
        <li className="py-2">
          <NavLink
            to={`/portal/manage-profile`}
            className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
            <label className="hover:cursor-pointer"><AccountCircleIcon className="flex align-text-bottom" fontSize="small" /> Manage Profile</label></NavLink>
        </li>
        <li className="py-2">
          <NavLink
            to={`/portal/password`}
            className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
            <label className="hover:cursor-pointer"><SecurityIcon className="flex align-text-bottom" fontSize="small" /> Password</label></NavLink>
        </li>

        <li className="py-2">
          <NavLink
            to={`/portal/subscription`}
            className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }
          >
            <label className="hover:cursor-pointer"><SubscriptionsIcon className="flex align-text-bottom" fontSize="small" /> Subscription</label></NavLink>
        </li>
        <li className="py-2">
          <NavLink className="px-6 py-4 h-auto flex flex-1 mb-auto" style={{ alignContent: 'flex-end' }} to={`/logout`}><label className="hover:cursor-pointer"><LogoutIcon className="flex align-text-bottom" fontSize="small" /> Logout</label></NavLink>
        </li>
      </ol>
    </nav>
  )
}