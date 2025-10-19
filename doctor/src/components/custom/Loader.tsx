function Loader() {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading patient data...</span>
    </div>
  )
}

export default Loader
