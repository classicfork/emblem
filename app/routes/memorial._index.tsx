export default function MemorialIndexRoute() {
    return (
      <div className="flex justify-center">
        <div className="shadow-slate-800 items-center max-w-md px-5 py-5">
          <div className="py-3 flex justify-center">
            <img src={'b.jpeg'} alt="Keith"/>
          </div>
          <div className="flex justify-center">
            <h3 className="text-2xl font-bold">Dennis Keith Myres</h3>
          </div>
          <div className="flex justify-around py-4">
            <p className="text-xl">1935</p>
            <p>-</p>
            <p className="text-xl">2017</p>
          </div>
          <div className="text-justify whitespace-pre-line">
            <p>
              Dennis Keith was born in Mountain, North Dakota to an Icelandic family, and as a young boy moved to National City, California (part of San Diego). He joined the Church of Jesus Christ of Latter-day Saints in his early 20's, and his testimony guided his path in fatherhood, work, and his dealings with everyone around him.
            </p>
            <p>His wife of over 50 years, Paula Haymond, 9 children, and over 50 grandchildren survive him. His great legacy lives on in all of them.</p>
          </div>
        </div>
        <div className="absolute bottom-3">
          <div className="divide-x flex justify-center">
            <div className="bg-slate-600 px-4 py-1 text-blue-100 hover:bg-blue-500 active:bg-blue-600">
              <p>Obituary</p>
            </div>
            <div className="bg-slate-600 px-4 py-1 text-blue-100 hover:bg-blue-500 active:bg-blue-600">
              <p>Links</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

export function ErrorBoundary() {
    return (
      <div className="error-container">
        I did a whoopsies.
      </div>
    );
}