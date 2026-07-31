"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelData {
  name: string;
  users: number;
  dropoff: string;
}

export function FunnelChart({ data, variant }: { data: FunnelData[], variant: string }) {
  
  // Colores según la variante para diferenciar
  const fillColor = variant === 'b_wizard' ? '#f08c3e' : '#0ea5e9'; // Naranja para Wizard, Azul para Tabs

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-zinc-200 shadow-lg rounded-xl">
          <p className="font-bold text-zinc-800">{label}</p>
          <p className="text-sm text-zinc-600 mt-1">
            Usuarios: <span className="font-bold text-zinc-900">{current.users}</span>
          </p>
          <p className="text-xs text-red-500 mt-1 font-medium">
            Tasa de retención: {current.dropoff}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#52525b', fontSize: 13, fontWeight: 500 }}
            width={180}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#f4f4f5'}} />
          <Bar 
            dataKey="users" 
            radius={[0, 4, 4, 0]} 
            barSize={40}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={fillColor} fillOpacity={0.8 + (index * 0.05)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
