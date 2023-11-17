import { Avatar, MenuItem, Button } from "@mui/material";
import { NavLink } from "@remix-run/react";
import { navConfig } from '../config/navConfig';

export default function Header({ user }: any) {
  return (
    <header>
      <div>
        <img className="absolute w-12 t-12 scale-50" src={'http://localhost:3000/emblem-dark.png'} alt="emblem-logo" />
      </div>
      <nav className="py-2 px-4">
        <div className="flex justify-center">
          <div className="flex">
            {navConfig.map((item, index) => (
              <MenuItem key={index} disableRipple style={{ backgroundColor: 'transparent' }}>
                <NavLink style={({ isActive, isPending }) => {
                  return {
                    textDecoration: 'none',
                    color: isActive ? "black" : "inherit",
                    borderBottom: isActive ? `1px solid` : "inherit",
                  };
                }}
                  className={({ isActive, isPending }) => {
                    return isActive ? "active" : isPending ? "pending" : "";
                  }}
                  to={item.path}
                >
                  {item.name}
                </NavLink>
              </MenuItem>
            ))}
            <MenuItem disableRipple style={{ backgroundColor: 'transparent' }}>
              <NavLink style={({ isActive, isPending }) => {
                return {
                  textDecoration: 'none',
                  color: isActive ? "black" : "inherit",
                  borderBottom: isActive ? `1px solid` : "inherit",
                };
              }}
                className={({ isActive, isPending }) => {
                  return isActive ? "active" : isPending ? "pending" : "";
                }}
                to={'/search'}
              >
                {'Search'}
              </NavLink>
            </MenuItem>
            <span className="mt-1">|</span>
            {user ?
              <div className="flex">
                <MenuItem disableRipple style={{ backgroundColor: 'transparent' }}>
                  <NavLink style={({ isActive, isPending }) => {
                    return {
                      textDecoration: 'none',
                      color: isActive ? "black" : "inherit",
                      borderBottom: isActive ? `1px solid` : "inherit",
                    };
                  }}
                    className={({ isActive, isPending }) => {
                      return isActive ? "active" : isPending ? "pending" : "";
                    }}
                    to={'/portal/home'}
                  >
                    Profile
                  </NavLink>
                </MenuItem>
                <Avatar sx={{ width: 24, height: 24, marginTop: 0.8 }} className="bg-gradient-to-r from-emerald-500 to-sky-500" />
              </div>
              :
              <NavLink
                style={{ color: 'black' }}
                to={'/login'}
              >
                <Button variant="outlined" style={{ borderRadius: 20, border: '3px solid', fontWeight: 800, transform: 'scale(0.8)' }}>
                  Sign In
                </Button>
              </NavLink>
            }
          </div>
        </div>
      </nav>
    </header>
  )
}