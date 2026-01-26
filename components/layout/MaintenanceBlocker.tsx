import React from 'react'

export function MaintenanceBlocker() {
    return (
        <div className="fixed inset-0 z-[10000] bg-white/30 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overscroll-none touch-none">
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50 max-w-5xl w-full mx-auto overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Column: Video */}
                    <div className="relative aspect-video md:aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-black/5 order-last md:order-first">
                        <img
                            src="/media (3).gif"
                            alt="Maintenance Mode"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Column: Content */}
                    <div className="text-center md:text-left space-y-6 py-4 flex flex-col justify-center h-full">
                        <div>
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-teal-50 text-4xl mb-6 shadow-sm">
                                🛠️
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                System
                                <span className="block text-teal-500">Maintenance</span>
                            </h2>
                            <div className="space-y-4">
                                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                                    The system is currently under maintenance 😭
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-base text-gray-700 font-medium">
                                        Please use the <span className="text-teal-600 font-bold">manual process</span> in the Lilo group chat on WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-auto md:mt-8 border-t border-gray-100">
                            <p className="text-xs font-bold text-teal-500 uppercase tracking-[0.2em]">
                                - jovenVA dev team
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
