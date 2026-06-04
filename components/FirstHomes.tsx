export default function FirstHomes() {
  const images = Array(36).fill('https://maniagosafaris.com/images/lff/dignity_housing/')
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="w-full md:w-4/5 mx-auto">
        <h3 className="text-3xl text-lff_800 my-20 font-bold text-center">
          The making of the first Homes
        </h3>
        <div className="flex flex-wrap w-full">
          {images.map((base, i) => (
            <div key={i} className="flex w-1/2 md:w-1/3 p-3">
              <div className="overflow-hidden w-full">
                <img src={`${base}${i + 1}.jpg`} className="w-full" alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
