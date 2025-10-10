export function OccupationListSkeleton({ title, description, className = "" }: { title: string; description: string; className?: string }) {
    return (
        <section className={`py-16 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                    <div className="w-full lg:w-80">
                        <div className="w-full rounded-lg border border-input px-3 py-2 bg-white">
                            <div className="h-5 w-1/2 bg-gray-200 animate-pulse rounded" />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-8 w-16 bg-gray-200 animate-pulse rounded-md" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="block bg-white rounded-lg border border-input py-2 px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex-1">
                                    <div className="h-5 w-64 bg-gray-200 animate-pulse rounded mb-2" />
                                    <div className="flex items-center text-muted-foreground mt-1 gap-2">
                                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                                    </div>
                                </div>
                                <div className="mt-2 sm:mt-0 sm:ml-6 text-right">
                                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded ml-auto" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


