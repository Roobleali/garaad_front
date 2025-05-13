import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";

interface SignupFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: string;
  }) => void;
}

// Signup form component for collecting user information
export function SignupForm({ onSubmit }: SignupFormProps) {
  const [showAdditionalFields, setShowAdditionalFields] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: ''
  });

  // Handle input changes and show additional fields when email contains @
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white rounded-xl p-10 max-w-2xl w-full mx-6 shadow-2xl"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Waxbarashadaada waa diyaar!</h2>
              <p className="text-gray-600">Samee akoon bilaash ah si aad u bilowdo.</p>
            </div>
            <Image src="/rocket.svg" alt="" width={80} height={80} />
          </div>

          <div className="space-y-6">


            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">AMA</span>
              </div>
            </div>

            {/* Progressive Form */}
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Iimaylka"
                className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                style={{ fontSize: '16px' }}
                value={formData.email}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value.includes('@')) {
                    setShowAdditionalFields(true);
                  }
                }}
              />

              {showAdditionalFields && (
                <div className="space-y-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Furaha sirta ah"
                    className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                    style={{ fontSize: '16px' }}
                    value={formData.password}
                    onChange={handleInputChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Magaca koowaad"
                      className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                      style={{ fontSize: '16px' }}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />

                    <input
                      type="number"
                      name="age"
                      placeholder="Da'da"
                      className="w-full p-3 md:p-4 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base md:text-lg"
                      style={{ fontSize: '16px' }}
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
              )}

              <button
                className="w-full bg-black text-white rounded-xl p-4 hover:bg-black/90 transition-colors relative cursor-not-allowed opacity-60"
                onClick={(e) => e.preventDefault()}
                disabled
              >
                Is diiwaan geli
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                  Dhowaan
                </span>
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Marka aad guujiso Is diiwaan geli, waxaad ogoshahay{" "}
              <a href="#" className="underline">Shuruudaha</a> iyo{" "}
              <a href="#" className="underline">Xogta gaarka ah</a>
            </p>

            <div className="text-center">
              <span className="text-sm text-gray-600">Horay ma u diiwaan gashay? </span>
              <a href="#" className="text-sm text-blue-600 hover:underline">Soo gal</a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
