import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  HelpCircle,
  Clock,
  MapPin,
  Flame,
  UtensilsCrossed
} from "lucide-react";

interface Preset {
  dishName: string;
  ingredients: string;
}

const PRESETS: Preset[] = [
  {
    dishName: "Kesar Elaichi Chai",
    ingredients: "Kashmiri saffron, organic green cardamom, rich Assam CTC tea leaves",
  },
  {
    dishName: "Kolkata Double Egg Roll",
    ingredients: "Flaky hand-tossed paratha, farm-fresh eggs, raw onion, green chillies, tangy Kasundi mustard",
  },
  {
    dishName: "Baked Nolen Gur Sandesh",
    ingredients: "Fresh cottage cheese (chhena), liquid date palm jaggery, crushed pistachios",
  },
  {
    dishName: "Darjeeling First Flush",
    ingredients: "Spring-harvested whole tea leaves, mineral water, optional hint of wild honey",
  }
];

const LOADING_STEPS = [
  "Boiling the water...",
  "Steeping the perfect words...",
  "Adding a pinch of sensory description...",
  "Garnishing with Kolkata charm...",
];

export default function App() {
  const [dishName, setDishName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Rotate through loading messages for an immersive café feel
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1800);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handlePresetClick = (preset: Preset) => {
    setDishName(preset.dishName);
    setIngredients(preset.ingredients);
    setError(null);
  };

  const handleReset = () => {
    setDishName("");
    setIngredients("");
    setDescription("");
    setError(null);
  };

  const handleWriteDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      setError("Please enter a dish name.");
      return;
    }
    if (!ingredients.trim()) {
      setError("Please specify at least key ingredients.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDescription("");

    try {
      const response = await fetch("/api/write-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishName: dishName.trim(),
          ingredients: ingredients.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate menu description.");
      }

      setDescription(data.description);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while connecting to the café chef.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!description) return;
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cafe-cream selection:bg-cafe-amber-100 selection:text-cafe-navy-950 font-sans">
      {/* Premium Cafe Branding Header */}
      <header id="header-section" className="bg-cafe-navy-950 text-white border-b-4 border-cafe-amber-500 py-6 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-cafe-amber-500 p-2.5 rounded-xl shadow-inner text-cafe-navy-950 flex items-center justify-center">
              <Coffee className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-mono text-cafe-amber-400 font-bold">Kolkata Café</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cafe-amber-500"></span>
                <span className="text-xs tracking-wide text-gray-300 font-medium">Menu Writer Tool</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-white">
                Chai Point <span className="text-cafe-amber-500">Menu Copywriter</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 bg-cafe-navy-900 px-4 py-2 rounded-lg border border-cafe-navy-800">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cafe-amber-500" />
              <span>Kolkata, IN</span>
            </div>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cafe-amber-500" />
              <span>Staff Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main id="main-workspace" className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Presets */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-cafe-sand">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-semibold text-cafe-navy-950 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-cafe-amber-600" />
                Dish Blueprint
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 text-cafe-navy-600 hover:text-cafe-navy-900 bg-cafe-sand/30 hover:bg-cafe-sand/60 rounded-md transition-colors font-medium border border-cafe-sand/50"
              >
                <RotateCcw className="w-3 h-3" />
                Clear Form
              </button>
            </div>

            <form onSubmit={handleWriteDescription} className="space-y-5">
              <div>
                <label htmlFor="dish-name-input" className="block text-sm font-semibold text-cafe-navy-800 mb-2">
                  Dish Name <span className="text-cafe-amber-600">*</span>
                </label>
                <input
                  id="dish-name-input"
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g., Kesar Elaichi Chai or Kolkata Egg Roll"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-cafe-sand bg-cafe-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cafe-amber-500/30 focus:border-cafe-amber-600 text-cafe-navy-900 transition-all font-medium placeholder-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="ingredients-input" className="block text-sm font-semibold text-cafe-navy-800">
                    Three Key Ingredients <span className="text-cafe-amber-600">*</span>
                  </label>
                  <span className="text-xs font-mono text-cafe-navy-600 bg-cafe-sand/40 px-2 py-0.5 rounded-full">Sensory focus</span>
                </div>
                <textarea
                  id="ingredients-input"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., Kashmiri saffron, green cardamom, CTC tea leaves (be sensory and descriptive!)"
                  required
                  rows={3}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-cafe-sand bg-cafe-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cafe-amber-500/30 focus:border-cafe-amber-600 text-cafe-navy-900 transition-all font-medium placeholder-gray-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                  isLoading 
                    ? "bg-cafe-navy-700 cursor-not-allowed opacity-90"
                    : "bg-cafe-navy-900 hover:bg-cafe-navy-950 border border-cafe-navy-800 hover:shadow-lg active:translate-y-[1px]"
                }`}
              >
                <Sparkles className={`w-5 h-5 text-cafe-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Write Description</span>
              </button>
            </form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex gap-2.5 items-start"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Copywriting Interrupted</h4>
                    <p className="mt-0.5 text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick-Load Presets Area */}
          <div className="bg-cafe-sand/30 rounded-2xl p-5 border border-cafe-sand/70">
            <h3 className="text-xs uppercase tracking-wider text-cafe-navy-700 font-mono font-bold mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-cafe-amber-600" />
              Café Favorite Presets
            </h3>
            <p className="text-xs text-cafe-navy-600 mb-4">
              Select one of our signature Kolkata delicacies to quickly auto-populate the recipe writer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((preset, idx) => {
                const isSelected = dishName === preset.dishName;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                      isSelected
                        ? "bg-white border-cafe-amber-500 shadow-sm ring-1 ring-cafe-amber-500"
                        : "bg-white/80 hover:bg-white border-cafe-sand hover:border-cafe-amber-400/50"
                    }`}
                  >
                    <span className="font-semibold text-cafe-navy-900">{preset.dishName}</span>
                    <span className="text-cafe-navy-600 truncate">{preset.ingredients}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Copywriting Outcome */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <div className="bg-white rounded-2xl border border-cafe-sand shadow-sm overflow-hidden flex flex-col">
            {/* Menu Header Decorative Accent */}
            <div className="bg-cafe-navy-950 px-6 py-4 flex items-center justify-between border-b border-cafe-navy-900">
              <span className="font-serif italic text-cafe-amber-400 text-sm tracking-wide">La Carte de Chai Point</span>
              <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Kolkata, Spice & Soul</span>
            </div>

            <div className="p-6 md:p-8 flex-1 min-h-[300px] flex flex-col justify-between">
              
              {/* Core Output Logic */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    /* Custom, gorgeous loading experience */
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5 py-6 text-center"
                    >
                      <div className="inline-block relative">
                        <Coffee className="w-12 h-12 text-cafe-amber-600 animate-bounce mx-auto" />
                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cafe-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cafe-amber-500"></span>
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-cafe-navy-900 font-serif italic text-lg font-medium">
                          &ldquo;{LOADING_STEPS[loadingStepIndex]}&rdquo;
                        </p>
                        <p className="text-xs font-mono text-cafe-navy-600 uppercase tracking-widest animate-pulse">
                          Brewing dynamic descriptions
                        </p>
                      </div>

                      {/* Loading skeleton bars */}
                      <div className="max-w-xs mx-auto space-y-2">
                        <div className="h-3 bg-cafe-sand/60 rounded-full w-full animate-pulse" />
                        <div className="h-3 bg-cafe-sand/60 rounded-full w-5/6 mx-auto animate-pulse" />
                        <div className="h-3 bg-cafe-sand/60 rounded-full w-4/5 mx-auto animate-pulse" />
                      </div>
                    </motion.div>
                  ) : description ? (
                    /* Elegant generated text output formatted like a café menu description */
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-4 space-y-6 text-center"
                    >
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs text-cafe-amber-600 font-mono uppercase tracking-widest bg-cafe-amber-50 px-2.5 py-1 rounded-full border border-cafe-amber-100">
                          <Sparkles className="w-3 h-3" />
                          Freshly Brewed Copy
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-cafe-navy-950 underline decoration-cafe-amber-400 decoration-wavy underline-offset-4">
                          {dishName}
                        </h3>
                      </div>

                      <div className="relative px-4 py-3 bg-cafe-cream/40 rounded-2xl border border-dashed border-cafe-sand/80">
                        <p className="text-base font-serif italic text-cafe-navy-900 leading-relaxed text-center font-medium">
                          &ldquo;{description}&rdquo;
                        </p>
                      </div>

                      {/* Word counter info */}
                      <div className="text-[11px] font-mono text-cafe-navy-600 flex items-center justify-center gap-1">
                        <span>Word count:</span>
                        <span className="font-bold text-cafe-navy-900">
                          {description.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <span>•</span>
                        <span>Crafted for Kolkata sensory boards</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Initial/empty placeholder */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10 space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-cafe-cream border border-cafe-sand flex items-center justify-center mx-auto text-cafe-navy-600">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5 max-w-xs mx-auto">
                        <h3 className="font-serif font-semibold text-cafe-navy-900 text-lg">Menu Slate Empty</h3>
                        <p className="text-sm text-cafe-navy-600">
                          Provide a dish name and key ingredients on the left, then click <strong>Write Description</strong> to compose delicious copy.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action area & copy controls */}
              <div className="border-t border-cafe-sand mt-6 pt-6">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!description || isLoading}
                  className={`w-full py-3 px-5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all ${
                    !description || isLoading
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : copied
                        ? "bg-emerald-600 text-white border border-emerald-700 shadow-sm"
                        : "bg-cafe-amber-500 hover:bg-cafe-amber-600 text-cafe-navy-950 border border-cafe-amber-600 hover:shadow shadow-sm active:translate-y-[1px]"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 shrink-0" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 shrink-0" />
                      <span>Copy Menu Description</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Footer Branding and Info */}
      <footer id="footer-section" className="bg-cafe-navy-950 text-gray-400 py-6 px-4 text-center border-t border-cafe-navy-900 mt-12 text-xs">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-serif italic text-white text-sm">
            Chai Point Kolkata — Est. 2026
          </p>
          <p className="text-gray-500">
            Staff copywriting toolkit powered by Google Gemini 3.5 Flash. Crafted with meticulous typography.
          </p>
        </div>
      </footer>
    </div>
  );
}
