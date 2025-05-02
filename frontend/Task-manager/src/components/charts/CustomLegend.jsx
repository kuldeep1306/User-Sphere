import React from 'react'

const CustomLegend = ({payload}) => {
  return (
    <div className="flex items-center space-x-6 gap-2 mt-4">
        {payload.map((entry, index) => (
            <div key={`legend-${index}`} 
            className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full"
                style={{ background: entry.color }}
                ></div>
                <span className=" text-xs font-medium text-gray-600">{entry.value}</span>
            </div>
        ))}
    </div>

  )
}

export default CustomLegend