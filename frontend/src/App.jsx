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