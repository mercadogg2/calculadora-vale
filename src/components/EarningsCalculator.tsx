import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

// Service types with default rates (in BRL)
const SERVICE_TYPES = [
  { id: 'cleaning', name: 'Limpeza / Diarista', defaultRate: 180, unit: 'por dia', type: 'daily' },
  { id: 'electrician', name: 'Eletricista', defaultRate: 120, unit: 'por hora', type: 'hourly' },
  { id: 'plumber', name: 'Encanador', defaultRate: 120, unit: 'por hora', type: 'hourly' },
  { id: 'gardener', name: 'Jardinagem', defaultRate: 150, unit: 'por serviço', type: 'job' },
  { id: 'assembly', name: 'Montador de Móveis', defaultRate: 80, unit: 'por móvel', type: 'job' },
  { id: 'ac', name: 'Instalação de Ar Condicionado', defaultRate: 450, unit: 'por instalação', type: 'job' },
  { id: 'manicure', name: 'Manicure / Pedicure', defaultRate: 50, unit: 'por serviço', type: 'job' },
  { id: 'cook', name: 'Cozinheira(o)', defaultRate: 200, unit: 'por dia', type: 'daily' },
  { id: 'nanny', name: 'Babá', defaultRate: 35, unit: 'por hora', type: 'hourly' },
  { id: 'elderly_care', name: 'Cuidador(a) de Idosos', defaultRate: 180, unit: 'por plantão', type: 'daily' },
  { id: 'painter', name: 'Pintor(a)', defaultRate: 250, unit: 'por dia', type: 'daily' },
  { id: 'mason', name: 'Pedreiro / Reformas', defaultRate: 280, unit: 'por dia', type: 'daily' },
  { id: 'camera_installer', name: 'Instalador de Câmeras', defaultRate: 120, unit: 'por ponto', type: 'job' },
];

export default function EarningsCalculator() {
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0]);
  const [rate, setRate] = useState(SERVICE_TYPES[0].defaultRate);
  const [volume, setVolume] = useState(5); // Days/Hours/Jobs per week
  const [platformFee, setPlatformFee] = useState(15); // Percentage
  const [expenses, setExpenses] = useState(200); // Monthly expenses

  // Update rate when service changes
  useEffect(() => {
    setRate(selectedService.defaultRate);
  }, [selectedService]);

  // Calculations
  const weeklyGross = rate * volume;
  const monthlyGross = weeklyGross * 4.2; // Approx weeks in month
  
  const monthlyFeeAmount = monthlyGross * (platformFee / 100);
  const monthlyNet = monthlyGross - monthlyFeeAmount - expenses;
  const yearlyNet = monthlyNet * 12;

  // Chart Data
  const data = [
    { name: 'Semana', valor: weeklyGross - (weeklyGross * (platformFee/100)) - (expenses/4.2) },
    { name: 'Mês', valor: monthlyNet },
    { name: '6 Meses', valor: monthlyNet * 6 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-brand-dark text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-teal p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Vale Conecta</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Parceiros</p>
            </div>
          </div>
          <a 
            href="https://valeconecta.com.br/registro/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-brand-teal hover:bg-teal-600 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm"
          >
            Cadastre-se Agora <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Simule seus ganhos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Descubra quanto você pode faturar oferecendo seus serviços na plataforma Vale Conecta. 
              Você define seu preço e sua agenda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-dark mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-teal" />
                  Detalhes do Serviço
                </h3>

                <div className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qual serviço você presta?
                    </label>
                    <select 
                      value={selectedService.id}
                      onChange={(e) => {
                        const service = SERVICE_TYPES.find(s => s.id === e.target.value);
                        if (service) setSelectedService(service);
                      }}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-brand-teal outline-none transition-all"
                    >
                      {SERVICE_TYPES.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rate Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quanto você cobra {selectedService.unit}?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                      <input 
                        type="number" 
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-brand-teal outline-none transition-all font-mono text-lg"
                      />
                    </div>
                  </div>

                  {/* Volume Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedService.type === 'daily' ? 'Quantos dias por semana?' : 
                       selectedService.type === 'hourly' ? 'Quantas horas por semana?' : 
                       'Quantos serviços por semana?'}
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1" 
                        max={selectedService.type === 'hourly' ? 60 : 7}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                      />
                      <span className="bg-brand-teal/10 text-brand-teal font-bold px-3 py-1 rounded-lg min-w-[3rem] text-center">
                        {volume}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setPlatformFee(platformFee === 15 ? 0 : 15);
                      }}
                      className="text-xs text-gray-500 flex items-center gap-1 hover:text-brand-teal transition-colors"
                    >
                      <Info className="w-3 h-3" />
                      {platformFee > 0 ? 'Simulando com taxa da plataforma (15%)' : 'Simulando sem taxa da plataforma'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-brand-dark text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                  Por que Vale Conecta?
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5"></span>
                    Pagamento garantido toda semana
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5"></span>
                    Você define sua própria agenda
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5"></span>
                    Suporte dedicado ao parceiro
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Main Result Card */}
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-teal">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h2 className="text-gray-500 font-medium mb-1">Estimativa Mensal Líquida</h2>
                    <div className="text-5xl font-bold text-brand-dark tracking-tight">
                      {formatCurrency(monthlyNet)}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Potencial Alto
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Semanal</p>
                    <p className="text-xl font-bold text-brand-dark">{formatCurrency(weeklyGross - (weeklyGross * (platformFee/100)))}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Anual</p>
                    <p className="text-xl font-bold text-brand-dark">{formatCurrency(yearlyNet)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Taxa Média</p>
                    <p className="text-xl font-bold text-brand-dark">{platformFee}%</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-64 w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => `R$${value/1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [formatCurrency(value), 'Valor Líquido']}
                      />
                      <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={60}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 1 ? '#00ab94' : '#2A2A2B'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-brand-teal text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Pronto para começar?</h3>
                  <p className="text-teal-100">Junte-se a mais de 10.000 profissionais no Vale Conecta.</p>
                </div>
                <a 
                  href="https://valeconecta.com.br/registro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap bg-white text-brand-teal hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block text-center"
                >
                  Criar Perfil Grátis
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
