import React from 'react'

export function MaintenanceBlocker() {
    return (
        <div className="fixed inset-0 z-[10000] bg-white/30 backdrop-blur-md flex items-center justify-center p-8 text-center overscroll-none touch-none">
            <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-white/50 max-w-sm mx-auto">
                <div className="mb-4 flex justify-center">
                    <span className="text-4xl">🛠️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">System Maintenance</h2>
                <p className="text-gray-600 font-medium leading-relaxed">
                    system is on maintenance 😭 please use the manual Lilo on whataspp
                </p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">
                        - jovenVA dev team
                    </p>
                </div>
            </div>
        </div>
    )
}
