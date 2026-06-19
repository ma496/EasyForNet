import React from 'react'

/**
 * Layout shell for all routes inside the (auth) route group, providing the shared page background and text color.
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen text-black dark:text-white-dark">{children} </div>
}

export default AuthLayout
