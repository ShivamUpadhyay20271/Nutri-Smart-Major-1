import { useState, useEffect } from "react"
import { LuUser, LuUsers, LuList, LuBell, LuLogOut, LuMenu, LuX } from "react-icons/lu"

export default function NGOSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { path: "/ngo/dashboard", label: "Account", icon: <LuUser className="w-5 h-5" /> },
    { path: "/ngo/dashboard/donors", label: "Donors", icon: <LuUsers className="w-5 h-5" /> },
    { path: "/ngo/dashboard/donations", label: "Donation List", icon: <LuList className="w-5 h-5" /> },
    { path: "/ngo/dashboard/notifications", label: "Notifications", icon: <LuBell className="w-5 h-5" /> },
  ]

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-200 rounded-md"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-20 h-screen w-64 bg-gray-200 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-300">
            <h2 className="text-xl font-bold text-green-600">NGO Dashboard</h2>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-300 transition-colors ${
                      isActive(item.path) ? "bg-green-500 text-white hover:bg-green-600" : ""
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/ngo/logout"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <span className="mr-3">
                    <LuLogOut className="w-5 h-5" />
                  </span>
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
