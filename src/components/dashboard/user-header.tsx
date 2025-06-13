export function UserHeader() {
  return (
    <div className="relative h-32 w-full overflow-hidden border-b border-zinc-800">
      {/* Banner Image */}
      <div
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')",
        }}
      ></div>

      {/* User Info Overlay */}
      <div className="absolute bottom-4 left-4 flex items-center">
        <div className="mr-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
          <img src="/placeholder.svg?height=64&width=64" alt="Profile" className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-bold">First Name Last Name</h2>
            <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-black">VIP</span>
          </div>
          <p className="text-xs text-gray-400">
            blablabla blablabla blablabla blablabla blablabla blablabla blablabla blablabla blablabla
          </p>
        </div>
      </div>

      {/* Invite Friends Button */}
      <button className="absolute right-4 top-4 rounded-md bg-amber-500 px-3 py-1 text-sm font-medium text-black hover:bg-amber-600">
        Invite Friends
      </button>
    </div>
  )
}
