export default function Navbar(){

return(

<div className="w-full flex justify-between items-center p-6">

<div className="font-bold text-xl">
BeatSignal
</div>

<div className="flex gap-4">

<button className="text-gray-700">
Login
</button>

<button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
Upgrade Plan
</button>

</div>

</div>

)

}