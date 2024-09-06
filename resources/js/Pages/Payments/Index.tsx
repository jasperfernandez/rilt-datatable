import { Head, Link, router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import SimplePagination from '@/Components/SimplePagination';
import { useState } from 'react';
import {
    PAYMENT_STATUS_CLASS_MAP,
    PAYMENT_STATUS_TEXT_MAP,
} from '@/Layouts/constants';
import { DownloadIcon } from '@radix-ui/react-icons';

interface Payment {
    id: string;
    name: string;
    email: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
}

interface QueryParams {
    [key: string]: string;
}

interface SimpleLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

interface IndexProps {
    payments: {
        data: Payment[];
        links: SimpleLinks;
    };
    queryParams: QueryParams | null;
}

export default function Index({ payments, queryParams }: IndexProps) {
    const [selectStatusKey, setSelectStatusKey] = useState(+new Date());
    queryParams = queryParams || {};

    const fieldChanged = (name: string, value: string) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route('payments.index'), queryParams, {
            preserveScroll: true,
        });
    };

    const queryParamsStr = new URLSearchParams(queryParams).toString();

    return (
        <>
            <Head title="Payments DataTable"></Head>
            <div className="container mx-auto py-10">
                <Card className="p-4">
                    <h1 className="text-lg font-bold mb-4">TRILT Data Table</h1>
                    <div className="flex justify-end items-center space-x-2 py-2">
                        <Button variant={'outline'} asChild>
                            <a
                                href={
                                    route('payments.csv.export') +
                                    '?' +
                                    queryParamsStr
                                }   
                            >
                                <DownloadIcon className="h-4 w-4 me-2" />
                                csv
                            </a>
                        </Button>
                        <Button variant={'outline'} asChild>
                            <a
                                href={
                                    route('payments.xlsx.export') +
                                    '?' +
                                    queryParamsStr
                                }
                            >
                                <DownloadIcon className="h-4 w-4 me-2" />
                                xlsx
                            </a>
                        </Button>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            {/* <TableCaption>A list of your recent payments.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">
                                        Payment ID
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="py-2">
                                        <Input
                                            placeholder="Search Name"
                                            defaultValue={
                                                queryParams.search_name
                                            }
                                            onBlur={(e) =>
                                                fieldChanged(
                                                    'search_name',
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    fieldChanged(
                                                        'search_name',
                                                        e.currentTarget.value
                                                    );
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>
                                        <Input
                                            type="text"
                                            placeholder="Search Email"
                                            defaultValue={
                                                queryParams.search_email
                                            }
                                            onBlur={(e) =>
                                                fieldChanged(
                                                    'search_email',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </TableHead>
                                    <TableHead></TableHead>
                                    <TableHead className="w-[200px]">
                                        <Select
                                            key={selectStatusKey}
                                            defaultValue={
                                                queryParams.search_status
                                            }
                                            onValueChange={(value) =>
                                                fieldChanged(
                                                    'search_status',
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Payment Status
                                                    </SelectLabel>
                                                    <SelectItem value="pending">
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="processing">
                                                        Processing
                                                    </SelectItem>
                                                    <SelectItem value="success">
                                                        Success
                                                    </SelectItem>
                                                    <SelectItem value="failed">
                                                        Failed
                                                    </SelectItem>
                                                    <SelectSeparator />
                                                    <Button
                                                        className="w-full px-2"
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            delete queryParams[
                                                                'search_status'
                                                            ];
                                                            setSelectStatusKey(
                                                                +new Date()
                                                            );
                                                            fieldChanged(
                                                                'search_status',
                                                                ''
                                                            );
                                                        }}
                                                    >
                                                        Clear
                                                    </Button>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>

                            {payments.data.length == 0 ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell>No data found</TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {payments.data.map((payment: Payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">
                                                {payment.id}
                                            </TableCell>
                                            <TableCell>
                                                {payment.name}
                                            </TableCell>
                                            <TableCell>
                                                {payment.email}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {payment.amount}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={
                                                        PAYMENT_STATUS_CLASS_MAP[
                                                            payment.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        PAYMENT_STATUS_TEXT_MAP[
                                                            payment.status
                                                        ]
                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <DotsHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(
                                                                    payment.id
                                                                )
                                                            }
                                                        >
                                                            Copy payment ID
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            View customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            View payment details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}

                            {/* <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                                $2,500.00
                            </TableCell>
                        </TableRow>
                    </TableFooter> */}
                        </Table>
                    </div>
                    <div className="w-full flex justify-end items-center">
                        <SimplePagination
                            links={payments.links}
                            queryParams={queryParams}
                        ></SimplePagination>
                    </div>
                </Card>
            </div>
        </>
    );
}
