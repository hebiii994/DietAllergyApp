import React, { useState, useMemo, useEffect } from 'react';
import {
  Utensils,
  BookOpen,
  ShoppingCart,
  AlertTriangle,
  ChevronRight,
  Check,
  Info,
  Leaf,
  ChefHat,
  ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA & CONSTANTS ---

const ALERTS = [
  { id: 1, level: 'critical', text: 'ESCLUSIONE TOTALE: Nocciole, Arachidi, Pomodoro.' },
  { id: 2, level: 'warning', text: 'FRUTTA (Mela, Pera, Pesca): SOLO COTTA (Cross-reattività Betulla).' },
  { id: 3, level: 'warning', text: 'FUNGHI: SOLO FRESCHI (Rischio Istamina).' },
  { id: 4, level: 'info', text: 'LATTOSIO: Solo prodotti <0.1%.' },
  { id: 5, level: 'info', text: 'PIZZA SABATO: Tassativamente BIANCA.' },
];

const RECIPES = {
  'buckwheat-zucchini': {
    id: 'buckwheat-zucchini',
    name: 'Grano Saraceno con Zucchine',
    ingredients: [
      { name: 'Grano Saraceno', qty: 80, unit: 'g' },
      { name: 'Zucchine', qty: 200, unit: 'g' },
      { name: 'Olio EVO', qty: 10, unit: 'ml' }
    ],
    instructions: 'Cuocere il grano saraceno. Saltare le zucchine in padella con olio. Unire.',
    tags: ['Lunch', 'Option A']
  },
  'rice-shrimp': {
    id: 'rice-shrimp',
    name: 'Riso Venere con Gamberi',
    ingredients: [
      { name: 'Riso Venere', qty: 80, unit: 'g' },
      { name: 'Gamberi', qty: 150, unit: 'g' },
      { name: 'Zucchine', qty: 100, unit: 'g' }
    ],
    instructions: 'Bollire il riso. Scottare i gamberi. Servire tiepido.',
    tags: ['Lunch', 'Option B']
  },
  'chicken-lemon': {
    id: 'chicken-lemon',
    name: 'Petto di Pollo al Limone',
    ingredients: [
      { name: 'Petto di Pollo', qty: 150, unit: 'g' },
      { name: 'Limone', qty: 1, unit: 'pz' },
      { name: 'Insalata', qty: 100, unit: 'g' }
    ],
    instructions: 'Marinare il pollo col limone. Cuocere alla piastra.',
    tags: ['Dinner']
  },
  'quinoa-veg': {
    id: 'quinoa-veg',
    name: 'Quinoa alle Verdure',
    ingredients: [
      { name: 'Quinoa', qty: 80, unit: 'g' },
      { name: 'Carote', qty: 100, unit: 'g' },
      { name: 'Piselli', qty: 50, unit: 'g' }
    ],
    instructions: 'Sciacquare la quinoa. Cuocere per 15 min. Unire verdure cotte a vapore.',
    tags: ['Lunch', 'Option A']
  },
  'pasta-pesto': {
    id: 'pasta-pesto',
    name: 'Pasta (Senza Glutine) al Pesto di Rucola',
    ingredients: [
      { name: 'Pasta GF', qty: 80, unit: 'g' },
      { name: 'Rucola', qty: 50, unit: 'g' },
      { name: 'Pinoli', qty: 10, unit: 'g' }
    ],
    instructions: 'Frullare rucola, pinoli e olio. Condire la pasta.',
    tags: ['Lunch', 'Option B']
  },
  'fish-baked': {
    id: 'fish-baked',
    name: 'Orata al Forno',
    ingredients: [
      { name: 'Orata', qty: 200, unit: 'g' },
      { name: 'Patate', qty: 150, unit: 'g' },
      { name: 'Rosmarino', qty: 1, unit: 'rametto' }
    ],
    instructions: 'Cuocere in forno a 180°C per 25 minuti con patate a cubetti.',
    tags: ['Dinner']
  },
  'pizza-bianca': {
    id: 'pizza-bianca',
    name: 'Pizza Bianca (No Pomodoro)',
    ingredients: [
      { name: 'Base Pizza GF', qty: 1, unit: 'pz' },
      { name: 'Mozzarella <0.1%', qty: 100, unit: 'g' },
      { name: 'Verdure Grigliate', qty: 100, unit: 'g' }
    ],
    instructions: 'Condire con mozzarella e verdure. Cuocere in forno.',
    tags: ['Dinner', 'Weekend']
  },
  'cooked-fruit': {
    id: 'cooked-fruit',
    name: 'Mela Cotta alla Cannella',
    ingredients: [
      { name: 'Mela', qty: 1, unit: 'pz' },
      { name: 'Cannella', qty: 1, unit: 'pizzico' }
    ],
    instructions: 'Cuocere la mela a pezzetti con un po\' d\'acqua e cannella finché morbida.',
    tags: ['Snack', 'Safe']
  }
};

const MENU_DATA = [
  {
    day: 'Lunedì',
    lunch: {
      a: { name: 'Grano Saraceno con Zucchine', recipeId: 'buckwheat-zucchini' },
      b: { name: 'Riso Venere con Gamberi', recipeId: 'rice-shrimp' }
    },
    dinner: { name: 'Petto di Pollo al Limone', recipeId: 'chicken-lemon' },
    snack: { name: 'Mela Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Martedì',
    lunch: {
      a: { name: 'Quinoa alle Verdure', recipeId: 'quinoa-veg' },
      b: { name: 'Pasta al Pesto di Rucola', recipeId: 'pasta-pesto' }
    },
    dinner: { name: 'Orata al Forno', recipeId: 'fish-baked' },
    snack: { name: 'Pera Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Mercoledì',
    lunch: {
      a: { name: 'Grano Saraceno con Verdure', recipeId: 'buckwheat-zucchini' },
      b: { name: 'Riso Basmati con Pollo', recipeId: 'rice-shrimp' } // Reusing for demo
    },
    dinner: { name: 'Tacchino ai Ferri', recipeId: 'chicken-lemon' },
    snack: { name: 'Pesca Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Giovedì',
    lunch: {
      a: { name: 'Miglio con Zucca', recipeId: 'quinoa-veg' },
      b: { name: 'Pasta con Tonno', recipeId: 'pasta-pesto' }
    },
    dinner: { name: 'Uova Sode e Fagiolini', recipeId: 'fish-baked' },
    snack: { name: 'Mela Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Venerdì',
    lunch: {
      a: { name: 'Amaranto con Broccoli', recipeId: 'buckwheat-zucchini' },
      b: { name: 'Risotto allo Zafferano', recipeId: 'rice-shrimp' }
    },
    dinner: { name: 'Salmone al Vapore', recipeId: 'fish-baked' },
    snack: { name: 'Pera Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Sabato',
    lunch: {
      a: { name: 'Insalata di Riso', recipeId: 'rice-shrimp' },
      b: { name: 'Insalata di Riso', recipeId: 'rice-shrimp' } // No option
    },
    dinner: { name: 'Pizza Bianca', recipeId: 'pizza-bianca' },
    snack: { name: 'Frutta Cotta', recipeId: 'cooked-fruit' }
  },
  {
    day: 'Domenica',
    lunch: {
      a: { name: 'Pasta al Ragù Bianco', recipeId: 'pasta-pesto' },
      b: { name: 'Pasta al Ragù Bianco', recipeId: 'pasta-pesto' }
    },
    dinner: { name: 'Minestrone di Verdure', recipeId: 'quinoa-veg' },
    snack: { name: 'Mela Cotta', recipeId: 'cooked-fruit' }
  }
];

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-full py-3 transition-colors duration-200",
      active ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
    )}
  >
    <Icon size={24} className="mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const AlertCard = ({ alert }) => {
  const colors = {
    critical: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };
  const icons = {
    critical: AlertTriangle,
    warning: AlertTriangle,
    info: Info
  };
  const Icon = icons[alert.level];

  return (
    <div className={cn("p-4 rounded-lg border mb-3 flex items-start gap-3 shadow-sm", colors[alert.level])}>
      <Icon className="shrink-0 mt-0.5" size={20} />
      <p className="text-sm font-medium">{alert.text}</p>
    </div>
  );
};

const RecipeDetail = ({ recipeId, onBack }) => {
  const recipe = RECIPES[recipeId];
  if (!recipe) return <div>Ricetta non trovata</div>;

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 mb-4 font-medium hover:underline"
      >
        <ArrowLeft size={20} className="mr-1" /> Torna alle ricette
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{recipe.name}</h2>
          <div className="flex gap-2 flex-wrap">
            {recipe.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
            <Leaf size={18} className="mr-2 text-green-600" /> Ingredienti
          </h3>
          <ul className="space-y-2 mb-6">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between text-slate-600 text-sm border-b border-slate-50 pb-2 last:border-0">
                <span>{ing.name}</span>
                <span className="font-mono font-medium text-slate-400">{ing.qty}{ing.unit}</span>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
            <ChefHat size={18} className="mr-2 text-blue-600" /> Procedimento
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
};

const MenuDay = ({ dayData, option, setOption, onOpenRecipe }) => {
  const lunch = option === 'A' ? dayData.lunch.a : dayData.lunch.b;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">{dayData.day}</h3>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button
            onClick={() => setOption('A')}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              option === 'A' ? "bg-green-100 text-green-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Opz A
          </button>
          <button
            onClick={() => setOption('B')}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              option === 'B' ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Opz B
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Lunch */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Pranzo ({option})</span>
          <button
            onClick={() => onOpenRecipe(lunch.recipeId)}
            className="w-full text-left flex items-center justify-between group"
          >
            <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{lunch.name}</span>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400" />
          </button>
        </div>

        {/* Dinner */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Cena</span>
          <button
            onClick={() => onOpenRecipe(dayData.dinner.recipeId)}
            className="w-full text-left flex items-center justify-between group"
          >
            <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{dayData.dinner.name}</span>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400" />
          </button>
        </div>

        {/* Snack */}
        <div className="pt-2 border-t border-slate-50">
          <div className="flex items-center text-sm text-slate-500">
            <span className="font-medium mr-2 text-slate-400">Spuntino:</span>
            {dayData.snack.name}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingList = ({ menuData, lunchOptions }) => {
  const items = useMemo(() => {
    const list = {};

    menuData.forEach((day, index) => {
      const option = lunchOptions[index] || 'A';
      const meals = [
        day.lunch[option.toLowerCase()],
        day.dinner,
        day.snack
      ];

      meals.forEach(meal => {
        if (meal && meal.recipeId && RECIPES[meal.recipeId]) {
          RECIPES[meal.recipeId].ingredients.forEach(ing => {
            const key = ing.name;
            if (!list[key]) {
              list[key] = { ...ing, qty: 0 };
            }
            list[key].qty += ing.qty;
          });
        }
      });
    });

    return Object.values(list).sort((a, b) => a.name.localeCompare(b.name));
  }, [menuData, lunchOptions]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm mb-4">
        <p className="flex items-center gap-2">
          <Info size={16} />
          La lista è calcolata in base alle opzioni pranzo selezionate nel Menu.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {items.map((item, i) => (
          <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50" />
              <span className="text-slate-700 font-medium">{item.name}</span>
            </div>
            <span className="text-slate-400 font-mono text-sm">{item.qty} {item.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [lunchOptions, setLunchOptions] = useState({
    0: 'A', 1: 'A', 2: 'A', 3: 'A', 4: 'A', 5: 'A', 6: 'A'
  });
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const handleSetOption = (dayIndex, option) => {
    setLunchOptions(prev => ({ ...prev, [dayIndex]: option }));
  };

  const handleOpenRecipe = (id) => {
    setSelectedRecipeId(id);
    setActiveTab('recipes');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Diet Protocol</h1>
            <p className="text-xs text-slate-500 font-medium">Hypoallergenic • Low Histamine</p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
            JD
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'alerts' && (
          <div className="space-y-1 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Avvisi Clinici</h2>
            {ALERTS.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Menu Settimanale</h2>
            {MENU_DATA.map((day, index) => (
              <MenuDay
                key={index}
                dayData={day}
                option={lunchOptions[index] || 'A'}
                setOption={(opt) => handleSetOption(index, opt)}
                onOpenRecipe={handleOpenRecipe}
              />
            ))}
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="animate-in fade-in duration-300">
            {selectedRecipeId ? (
              <RecipeDetail
                recipeId={selectedRecipeId}
                onBack={() => setSelectedRecipeId(null)}
              />
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Ricettario</h2>
                <div className="grid gap-3">
                  {Object.values(RECIPES).map(recipe => (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipeId(recipe.id)}
                      className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-blue-300 transition-all shadow-sm group"
                    >
                      <h3 className="font-bold text-slate-700 group-hover:text-blue-600">{recipe.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{recipe.tags.join(' • ')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Lista della Spesa</h2>
            <ShoppingList menuData={MENU_DATA} lunchOptions={lunchOptions} />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-between px-2">
          <TabButton
            active={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
            icon={Utensils}
            label="Menu"
          />
          <TabButton
            active={activeTab === 'recipes'}
            onClick={() => { setActiveTab('recipes'); setSelectedRecipeId(null); }}
            icon={BookOpen}
            label="Ricette"
          />
          <TabButton
            active={activeTab === 'shopping'}
            onClick={() => setActiveTab('shopping')}
            icon={ShoppingCart}
            label="Spesa"
          />
          <TabButton
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
            icon={AlertTriangle}
            label="Alert"
          />
        </div>
      </nav>
    </div>
  );
}
