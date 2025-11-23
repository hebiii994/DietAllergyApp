import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChefHat, ShoppingCart, Calendar, Info, Check, ChevronRight, RefreshCw, Layers } from 'lucide-react';

const DietDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedDay, setSelectedDay] = useState(0);
  const [highlightedRecipe, setHighlightedRecipe] = useState(null);

  // Stato per memorizzare la scelta del pranzo per ogni giorno (0 = Opzione A, 1 = Opzione B)
  const [lunchSelections, setLunchSelections] = useState(Array(7).fill(0));

  const toggleLunchOption = (dayIndex) => {
    const newSelections = [...lunchSelections];
    newSelections[dayIndex] = newSelections[dayIndex] === 0 ? 1 : 0;
    setLunchSelections(newSelections);
  };

  const goToRecipe = (dishName) => {
    // Logica migliorata: Cerca la ricetta il cui nome è contenuto nel piatto
    // Ordina per lunghezza decrescente per trovare la corrispondenza più specifica (es. "Ragù Bianco" invece di un generico "Pasta")
    const targetRecipe = RECIPES
      .filter(r => dishName.toLowerCase().includes(r.name.toLowerCase()))
      .sort((a, b) => b.name.length - a.name.length)[0];

    if (targetRecipe) {
      setHighlightedRecipe(targetRecipe.name);
      setActiveTab('recipes');
    } else {
      // Fallback: prova a cercare parole chiave se non trova corrispondenza diretta
      const keywords = dishName.split(' ');
      const fallback = RECIPES.find(r => keywords.some(k => r.name.toLowerCase().includes(k.toLowerCase()) && k.length > 3));
      if (fallback) {
        setHighlightedRecipe(fallback.name);
        setActiveTab('recipes');
      }
    }
  };

  const ALERTS = [
    { type: 'critical', text: 'GRAMINACEE ++++: Se scegli pasta/riso spesso, ruota i cereali (Grano Saraceno, Quinoa, Legumi).' },
    { type: 'critical', text: 'NOCCIOLE e ARACHIDI: Evitare assolutamente.' },
    { type: 'critical', text: 'POMODORO: Escluso totalmente.' },
    { type: 'warning', text: 'BETULLA: Frutta solo cotta.' },
    { type: 'warning', text: 'LISTA SPESA: Aggiornata dinamicamente in base alle scelte del pranzo.' }
  ];

  const WEEKLY_MENU = [
    {
      day: 'Lunedì',
      lunchOptions: [
        {
          name: 'Pasta (Grano Saraceno) Zafferano e Zucchine',
          desc: 'Carboidrato Safe',
          ingredients: [{ n: 'Pasta Grano Saraceno', c: 'Pasta & Cereali' }, { n: 'Zucchine', c: 'Frutta & Verdura' }, { n: 'Zafferano', c: 'Dispensa' }]
        },
        {
          name: 'Risotto allo Zafferano e Zucchine',
          desc: 'Menu Originale (Riso)',
          ingredients: [{ n: 'Riso Carnaroli', c: 'Pasta & Cereali' }, { n: 'Zucchine', c: 'Frutta & Verdura' }, { n: 'Zafferano', c: 'Dispensa' }, { n: 'Brodo Vegetale', c: 'Dispensa' }]
        }
      ],
      dinner: { name: 'Petto di Tacchino alla piastra con Carote', ingredients: [{ n: 'Petto di Tacchino', c: 'Macelleria & Pesce' }, { n: 'Carote', c: 'Frutta & Verdura' }] },
      snack: { name: 'Composta di Pera cotta', ingredients: [{ n: 'Pere', c: 'Frutta & Verdura' }] }
    },
    {
      day: 'Martedì',
      lunchOptions: [
        {
          name: 'Pasta (Lenticchie) con Fagiolini e Uova',
          desc: 'Proteico Vegetale',
          ingredients: [{ n: 'Pasta di Lenticchie', c: 'Pasta & Cereali' }, { n: 'Fagiolini', c: 'Frutta & Verdura' }, { n: 'Uova Bio', c: 'Freschi & Latticini' }]
        },
        {
          name: 'Insalata di Patate, Fagiolini e Uova',
          desc: 'Menu Originale (Patate)',
          ingredients: [{ n: 'Patate', c: 'Frutta & Verdura' }, { n: 'Fagiolini', c: 'Frutta & Verdura' }, { n: 'Uova Bio', c: 'Freschi & Latticini' }]
        }
      ],
      dinner: { name: 'Merluzzo al forno con panure di erbe', ingredients: [{ n: 'Merluzzo', c: 'Macelleria & Pesce' }, { n: 'Farina di Mais (panure)', c: 'Pasta & Cereali' }] },
      snack: { name: 'Yogurt Senza Lattosio', ingredients: [{ n: 'Yogurt Zymil/Soia', c: 'Freschi & Latticini' }] }
    },
    {
      day: 'Mercoledì',
      lunchOptions: [
        {
          name: 'Pasta (Mais) con Crema di Zucchine',
          desc: 'Leggero',
          ingredients: [{ n: 'Pasta di Mais', c: 'Pasta & Cereali' }, { n: 'Zucchine', c: 'Frutta & Verdura' }]
        },
        {
          name: 'Riso Basmati e Zucchine',
          desc: 'Menu Originale',
          ingredients: [{ n: 'Riso Basmati', c: 'Pasta & Cereali' }, { n: 'Zucchine', c: 'Frutta & Verdura' }]
        }
      ],
      dinner: { name: 'Burger di Manzo "Homemade" con patate', ingredients: [{ n: 'Macinato Manzo Scelto', c: 'Macelleria & Pesce' }, { n: 'Patate', c: 'Frutta & Verdura' }] },
      snack: { name: 'Mela cotta alla cannella', ingredients: [{ n: 'Mele Golden', c: 'Frutta & Verdura' }, { n: 'Cannella', c: 'Dispensa' }] }
    },
    {
      day: 'Giovedì',
      lunchOptions: [
        {
          name: 'Pasta (Quinoa) con Funghi Freschi',
          desc: 'Alternativa Graminacee',
          ingredients: [{ n: 'Pasta di Quinoa', c: 'Pasta & Cereali' }, { n: 'Funghi Champignon Freschi', c: 'Frutta & Verdura' }]
        },
        {
          name: 'Pollo al Limone con Riso Basmati',
          desc: 'Menu Originale',
          ingredients: [{ n: 'Petto di Pollo', c: 'Macelleria & Pesce' }, { n: 'Limoni', c: 'Frutta & Verdura' }, { n: 'Riso Basmati', c: 'Pasta & Cereali' }]
        }
      ],
      dinner: { name: 'Frittata al forno con Bietole', ingredients: [{ n: 'Uova Bio', c: 'Freschi & Latticini' }, { n: 'Bietole', c: 'Frutta & Verdura' }] },
      snack: { name: 'Gallette di riso', ingredients: [{ n: 'Gallette di riso', c: 'Dispensa' }] }
    },
    {
      day: 'Venerdì',
      lunchOptions: [
        {
          name: 'Pasta (Riso) al Ragù Bianco di Carne',
          desc: 'Carne (No Pomodoro)',
          ingredients: [{ n: 'Pasta di Riso', c: 'Pasta & Cereali' }, { n: 'Macinato Manzo/Vitello', c: 'Macelleria & Pesce' }, { n: 'Carote/Sedano/Cipolla', c: 'Frutta & Verdura' }]
        },
        {
          name: 'Branzino al Cartoccio con Patate',
          desc: 'Menu Originale',
          ingredients: [{ n: 'Branzino fresco', c: 'Macelleria & Pesce' }, { n: 'Patate', c: 'Frutta & Verdura' }]
        }
      ],
      dinner: { name: 'Vellutata di Zucca e patate', ingredients: [{ n: 'Zucca', c: 'Frutta & Verdura' }, { n: 'Patate', c: 'Frutta & Verdura' }] },
      snack: { name: 'Pera cotta al forno', ingredients: [{ n: 'Pere', c: 'Frutta & Verdura' }] }
    },
    {
      day: 'Sabato',
      lunchOptions: [
        {
          name: 'Pasta (Grano Saraceno) Aglio, Olio e Erbe',
          desc: 'Veloce',
          ingredients: [{ n: 'Pasta Grano Saraceno', c: 'Pasta & Cereali' }, { n: 'Olio EVO', c: 'Dispensa' }]
        },
        {
          name: 'Bistecca ai ferri con Funghi',
          desc: 'Menu Originale',
          ingredients: [{ n: 'Bistecca Manzo', c: 'Macelleria & Pesce' }, { n: 'Funghi Champignon Freschi', c: 'Frutta & Verdura' }]
        }
      ],
      dinner: { name: 'PIZZA BIANCA Safe', ingredients: [{ n: 'Mozzarella <0.1%', c: 'Freschi & Latticini' }, { n: 'Farina/Base Pizza', c: 'Pasta & Cereali' }, { n: 'Prosciutto Cotto SL', c: 'Macelleria & Pesce' }] },
      snack: { name: 'Tè verde', ingredients: [{ n: 'Tè verde', c: 'Dispensa' }] }
    },
    {
      day: 'Domenica',
      lunchOptions: [
        {
          name: 'Pasta al Forno bianca (Vitello)',
          desc: 'Piatto Ricco',
          ingredients: [{ n: 'Pasta corta', c: 'Pasta & Cereali' }, { n: 'Macinato Vitello magro', c: 'Macelleria & Pesce' }, { n: 'Latte SL o Soia', c: 'Freschi & Latticini' }, { n: 'Farina di Riso', c: 'Pasta & Cereali' }]
        },
        {
          name: 'Arrosto di Vitello con Patate',
          desc: 'Menu Originale',
          ingredients: [{ n: 'Arrosto Vitello', c: 'Macelleria & Pesce' }, { n: 'Patate', c: 'Frutta & Verdura' }]
        }
      ],
      dinner: { name: 'Brodo vegetale con stracciatella', ingredients: [{ n: 'Parmigiano 36 mesi', c: 'Freschi & Latticini' }, { n: 'Uova Bio', c: 'Freschi & Latticini' }] },
      snack: { name: 'Gelatina di frutta', ingredients: [{ n: 'Colla di pesce', c: 'Dispensa' }] }
    }
  ];

  // Base ingredients always needed
  const STAPLES = [
    { n: 'Olio EVO', c: 'Dispensa' },
    { n: 'Sale Iodato', c: 'Dispensa' },
    { n: 'Aceto di Mele', c: 'Dispensa' }
  ];

  // Logic to generate Shopping List
  const generateShoppingList = () => {
    let allItems = [...STAPLES];

    WEEKLY_MENU.forEach((day, index) => {
      // Add Dinner ingredients
      if (day.dinner.ingredients) allItems = [...allItems, ...day.dinner.ingredients];
      // Add Snack ingredients
      if (day.snack.ingredients) allItems = [...allItems, ...day.snack.ingredients];
      // Add Dynamic Lunch ingredients
      const selectedLunch = day.lunchOptions[lunchSelections[index]];
      if (selectedLunch.ingredients) allItems = [...allItems, ...selectedLunch.ingredients];
    });

    // Group by Category
    const grouped = {};
    allItems.forEach(item => {
      if (!grouped[item.c]) grouped[item.c] = new Set();
      grouped[item.c].add(item.n);
    });

    // Convert to array format for rendering
    return Object.keys(grouped).map(cat => ({
      category: cat,
      items: Array.from(grouped[cat]).sort()
    }));
  };

  const currentShoppingList = generateShoppingList();

  const RECIPES = [
    {
      name: 'Ragù Bianco di Carne',
      tools: 'Padella / Pentola',
      steps: [
        'Tritare finemente carota, sedano e scalogno (soffritto).',
        'Rosolare il soffritto in olio EVO.',
        'Aggiungere 300g macinato misto (Manzo/Vitello o Pollo) e rosolare bene.',
        'Sfumare con vino bianco (o brodo) e lasciar evaporare.',
        'Aggiungere mestoli di brodo vegetale poco alla volta, cuocere per 40 min coperto.',
        'Profumare con erbe aromatiche (salvia/rosmarino) a piacere.'
      ]
    },
    {
      name: 'Pasta Zafferano e Zucchine',
      tools: 'Pentola / Padella',
      steps: [
        'Saltare le zucchine a julienne in padella con olio e scalogno.',
        'Sciogliere lo zafferano in acqua di cottura.',
        'Scolare la pasta al dente nella padella.',
        'Mantecare con parmigiano 36 mesi.'
      ]
    },
    {
      name: 'Risotto allo Zafferano e Zucchine',
      tools: 'Pentola / Bimby',
      steps: [
        'Tostare il riso con olio e scalogno.',
        'Sfumare con brodo vegetale.',
        'A metà cottura aggiungere zucchine e zafferano.',
        'Mantecare con olio o burro chiarificato.'
      ]
    },
    {
      name: 'Pasta con Funghi Freschi',
      tools: 'Padella',
      steps: [
        'Pulire i funghi freschi (NO secchi).',
        'Trifolare con olio e aglio 10 min.',
        'Saltare la pasta scolata con prezzemolo fresco.'
      ]
    },
    {
      name: 'Pollo al Limone',
      tools: 'Padella',
      steps: [
        'Infarinare straccetti di pollo (farina riso/mais).',
        'Rosolare in padella.',
        'Sfumare con succo di limone e poca acqua fino a formare crema.'
      ]
    },
    {
      name: 'Bistecca ai ferri',
      tools: 'Griglia/Ghisa',
      steps: [
        'Scaldare la piastra finché fuma.',
        'Cuocere carne 3-4 min per lato.',
        'Salare solo alla fine. Abbinare a funghi trifolati.'
      ]
    },
    {
      name: 'Pasta al Forno bianca',
      tools: 'Forno',
      steps: [
        'Ragù bianco: vitello, carote, sedano.',
        'Besciamella Safe: farina riso, olio, latte SL.',
        'Gratinare a 200°C per 20 min.'
      ]
    },
    {
      name: 'Arrosto di Vitello',
      tools: 'Pentola',
      steps: [
        'Rosolare la carne su tutti i lati.',
        'Cuocere coperto a fuoco basso per 1h con brodo e aromi.',
        'Tagliare freddo.'
      ]
    },
    {
      name: 'Burger di Manzo',
      tools: 'Piastra',
      steps: [
        'Impastare macinato scelto con sale e pepe (niente pane/uova).',
        'Formare i burger e cuocere su piastra rovente 3 min per lato.',
        'Servire con patate al forno.'
      ]
    },
    {
      name: 'Merluzzo al forno',
      tools: 'Forno',
      steps: [
        'Impanare il filetto con farina di mais tostato (o riso) ed erbe aromatiche.',
        'Filo d\'olio e forno a 180°C per 15 minuti.'
      ]
    },
    {
      name: 'PIZZA BIANCA Safe',
      tools: 'Forno',
      steps: [
        'Stendere la base (senza glutine se necessario o farina 0).',
        'Condire SOLO con olio, sale e mozzarella senza lattosio.',
        'Aggiungere zucchine o prosciutto cotto.',
        'Cuocere a 250°C per 10-12 minuti.'
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        const currentDayData = WEEKLY_MENU[selectedDay];
        const selectedLunchIndex = lunchSelections[selectedDay];
        const currentLunch = currentDayData.lunchOptions[selectedLunchIndex];

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 mb-4 overflow-x-auto pb-2">
              {WEEKLY_MENU.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-2 text-sm rounded-lg font-medium transition-colors whitespace-nowrap ${selectedDay === index
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  {day.day}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
                {currentDayData.day}
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  Configura il tuo pranzo
                </span>
              </h3>

              <div className="space-y-6">

                {/* PRANZO CON SWITCH */}
                <div className="bg-blue-50/50 -mx-3 p-3 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
                        <ChefHat size={18} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pranzo</span>
                    </div>
                    <button
                      onClick={() => toggleLunchOption(selectedDay)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-white border border-blue-200 px-2 py-1 rounded-full hover:bg-blue-50 shadow-sm transition-all"
                    >
                      <RefreshCw size={12} />
                      Cambia: {selectedLunchIndex === 0 ? 'Opzione B' : 'Opzione A'}
                    </button>
                  </div>

                  <div
                    onClick={() => goToRecipe(currentLunch.name)}
                    className="cursor-pointer hover:opacity-80 transition-opacity group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        {currentLunch.desc}
                      </span>
                      <ChevronRight size={16} className="text-blue-300 group-hover:text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-slate-800 leading-tight">
                      {currentLunch.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Clicca per la ricetta
                    </p>
                  </div>
                </div>

                {/* CENA */}
                <div
                  onClick={() => goToRecipe(currentDayData.dinner.name)}
                  className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="bg-indigo-100 p-2 rounded-full text-indigo-600"><ChefHat size={20} /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cena</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">{currentDayData.dinner.name}</p>
                  </div>
                </div>

                {/* SNACK */}
                <div className="flex items-start gap-3 p-2 -mx-2">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><Check size={20} /></div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spuntino</span>
                    <p className="text-base text-slate-600">{currentDayData.snack.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recipes':
        return (
          <div className="grid gap-4">
            {highlightedRecipe && (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded mb-2 flex justify-between items-center">
                <span>Visualizzazione ricetta selezionata</span>
                <button onClick={() => setHighlightedRecipe(null)} className="text-xs underline">Mostra tutte</button>
              </div>
            )}
            {RECIPES
              .filter(r => highlightedRecipe ? r.name === highlightedRecipe : true)
              .map((recipe, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{recipe.name}</h3>
                    <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                      {recipe.tools}
                    </span>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      {recipe.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-sm text-slate-600">
                          <span className="font-bold text-blue-500 min-w-[1.2rem]">{sIdx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            {highlightedRecipe && (
              <button
                onClick={() => setHighlightedRecipe(null)}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-200"
              >
                Torna all'elenco completo ricette
              </button>
            )}
          </div>
        );

      case 'shopping':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-2 items-start text-sm text-yellow-800 mb-2">
              <Layers size={18} className="shrink-0 mt-0.5" />
              <p>Questa lista è <strong>dinamica</strong>. Include gli ingredienti per le cene, gli spuntini e SOLO i pranzi che hai selezionato nel Tab Menu.</p>
            </div>
            {currentShoppingList.map((category, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {category.category}
                </h4>
                <ul className="space-y-2">
                  {category.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50 p-1 rounded cursor-pointer">
                      <div className="w-4 h-4 border-2 border-slate-300 rounded hover:border-blue-500"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-4">
            {ALERTS.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 flex gap-4 shadow-sm ${alert.type === 'critical'
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : 'bg-amber-50 border-amber-500 text-amber-900'
                  }`}
              >
                <div className="shrink-0 pt-1">
                  {alert.type === 'critical' ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div>
                  <h4 className="font-bold uppercase text-xs tracking-wider mb-1 opacity-80">
                    {alert.type === 'critical' ? 'Pericolo / Evitare' : 'Info'}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed">
                    {alert.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="bg-white px-6 py-5 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Protocollo Dinamico</h1>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
            Attivo
          </span>
        </div>
        <p className="text-xs text-slate-500">Configura il tuo pranzo giornaliero nel Menu</p>
      </div>

      <div className="p-4 pb-24">
        {renderContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-20 max-w-xl mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 ${activeTab === 'menu' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Calendar size={22} /><span className="text-[10px] font-bold uppercase">Menu</span>
        </button>
        <button onClick={() => setActiveTab('recipes')} className={`flex flex-col items-center gap-1 ${activeTab === 'recipes' ? 'text-blue-600' : 'text-slate-400'}`}>
          <ChefHat size={22} /><span className="text-[10px] font-bold uppercase">Ricette</span>
        </button>
        <button onClick={() => setActiveTab('shopping')} className={`flex flex-col items-center gap-1 ${activeTab === 'shopping' ? 'text-blue-600' : 'text-slate-400'}`}>
          <ShoppingCart size={22} /><span className="text-[10px] font-bold uppercase">Spesa</span>
        </button>
        <button onClick={() => setActiveTab('alerts')} className={`flex flex-col items-center gap-1 ${activeTab === 'alerts' ? 'text-red-600' : 'text-slate-400'}`}>
          <AlertTriangle size={22} /><span className="text-[10px] font-bold uppercase">Alert</span>
        </button>
      </div>
    </div>
  );
};

export default DietDashboard;
