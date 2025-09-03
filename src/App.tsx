import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8 space-y-6">
      {/* Typography Examples */}
      <div className="space-y-4">
        <h1 className="text-h1 text-primary-500">Heading 1 - Primary Color</h1>
        <h2 className="text-h2 text-primary-600">Heading 2 - Primary Color</h2>
        <h3 className="text-h3 text-primary-700">Heading 3 - Primary Color</h3>
        <p className="text-sub1 text-gray-600">Subtitle 1 - Gray Color</p>
        <p className="text-body1 text-gray-500">Body 1 - This is the main body text with Futura font</p>
        <p className="text-body2 text-gray-400">Body 2 - Smaller body text for secondary content</p>
        <span className="text-label text-gray-300">Label - Small text for labels</span>
      </div>

      {/* Bold Typography Examples */}
      <div className="space-y-4">
        <h1 className="text-h1-bold text-black">Heading 1 Bold - Black</h1>
        <h2 className="text-h2-bold text-gray-600">Heading 2 Bold - Gray</h2>
        <p className="text-body1-bold text-primary-500">Body 1 Bold - Primary Color</p>
      </div>

      {/* Color Examples */}
      <div className="space-y-4">
        <div className="bg-primary-500 text-white p-4 rounded">Primary Button</div>
        <p className="text-primary-600">Secondary text in primary color</p>
        <button className="bg-success text-white px-4 py-2 rounded">Success Button</button>
        <div className="bg-error text-white p-4 rounded">Error Message</div>
      </div>

      {/* Gray Scale Examples */}
      <div className="space-y-2">
        <div className="bg-gray-100 text-black p-2 rounded">Gray 100 Background</div>
        <div className="bg-gray-200 text-black p-2 rounded">Gray 200 Background</div>
        <div className="bg-gray-300 text-black p-2 rounded">Gray 300 Background</div>
        <div className="bg-gray-400 text-white p-2 rounded">Gray 400 Background</div>
        <div className="bg-gray-500 text-white p-2 rounded">Gray 500 Background</div>
        <div className="bg-gray-600 text-white p-2 rounded">Gray 600 Background</div>
      </div>
    </div>
  )
}

export default App
