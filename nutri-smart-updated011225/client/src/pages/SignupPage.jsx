import axios from "axios"
import { useState } from "react"
import Loader from "../components/shared/Loader"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [aadhar, setAadhar] = useState("")
  const [veg, setVeg] = useState(false)
  const [acceptedTNC, setAcceptedTNC] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    setLoading(true)
    setError("")
    e.preventDefault()
    setError("")

    if (email === "" || password === "") {
      setError("Please fill in all fields.")
      return
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "NGO") {
        window.location.href = "/ngodashboard"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err) {
      console.error(err)
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.")
      } else if (err.response && err.response.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError("Network error. Please check your connection.")
      }

    } finally {
      setLoading(false)
    }

  }

  if (loading) {
    return (
      <Loader />
    )
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
      style={{
        backgroundImage: "url('/placeholder.svg?height=800&width=800&text=🍕🥗🍔🥦')",
        backgroundSize: "200px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-orange-400 p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="aadhar" className="block text-gray-700 mb-2">
              Aadhar Number
            </label>
            <input
              type="text"
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-orange-200 border-0 focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div>
            <label htmlFor="dietaryPreference" className="block text-gray-700 mb-2">
              Dietary Preference
            </label>
            <label>
              <input 
                type="radio" 
                value="vegetarian"
                checked={veg}
                onChange={() => setVeg(true)}
                className="mr-2"
              />
              Vegetarian
            </label>

            <label className="ml-4">
              <input 
                type="radio" 
                value="non-vegetarian"
                checked={!veg}
                onChange={() => setVeg(false)}
                className="mr-2"
              />
              Non-Vegetarian
            </label>

          </div>



          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {/* <button
          type="button"
          className="w-full flex items-center justify-center border border-orange-400 text-orange-500 font-medium py-3 px-4 rounded-md hover:bg-orange-50 transition-colors"
        >
          
          Continue with Google
        </button> */}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
