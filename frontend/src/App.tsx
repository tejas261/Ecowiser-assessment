import Add from "./components/Add"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className=" h-full overflow-hidden">
    <Toaster/>
    <Navbar/>
    <Add/>
    </div>
  )
}

export default App

// w-20 h-20 bg-yellow-300 fixed left-[90%] bottom-[5%] my-2 rounded-[5rem] justify-center items-center flex xs:max-md:relative md:max-lg:translate-x-[-5rem] xs:max-md:translate-x-[-5rem]