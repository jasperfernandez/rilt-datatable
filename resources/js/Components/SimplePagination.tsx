import { Link } from '@inertiajs/react';
import { Button } from './ui/button';

interface SimpleLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

interface QueryParams {
    [key: string]: string;
}

interface SimplePaginationProps {
    links: SimpleLinks;
    queryParams?: QueryParams;
    className?: string;
}

export default function SimplePagination({
    links,
    queryParams,
    className = '',
}: SimplePaginationProps) {
    if (queryParams && queryParams['page']) {
        delete queryParams['page'];
    }
    const queryParamsStr = new URLSearchParams(queryParams).toString();
    const queryParamsNext = `${links.next}&${queryParamsStr}`; // page is added here
    const queryParamsPrev = `${links.prev}&${queryParamsStr}`; // page is added here

    return (
        <nav className={`mt-4 space-x-2 text-center ` + className}>
            {/* Previous */}
            {links.prev ? (
                <Button variant={'outline'} asChild>
                    <Link
                        preserveScroll
                        href={queryParamsPrev}
                        // className="inline-block px-4 py-2 text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-200"
                    >
                        Previous
                    </Link>
                </Button>
            ) : (
                <span className="text-gray-400 text-sm cursor-not-allowed">
                    Previous
                </span>
            )}

            {/* Next */}
            {links.next ? (
                <Button variant={'outline'} asChild>
                    <Link
                        preserveScroll
                        href={queryParamsNext}
                        // className="inline-block px-4 py-2 text-gray-700 rounded-lg bg-gray-50 hover:bg-gray-200"
                    >
                        Next
                    </Link>
                </Button>
            ) : (
                <span className="text-gray-400 text-sm cursor-not-allowed">
                    Next
                </span>
            )}
        </nav>
    );
}
