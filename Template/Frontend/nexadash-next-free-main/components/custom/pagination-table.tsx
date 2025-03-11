import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'

export default function PaginationTable({ table, data }: any) {
    return (
        <div className="flex flex-col items-center justify-end gap-2 py-3 sm:flex-row sm:gap-4">
            <div className="rounded-lg bg-white px-3 py-[7px] text-xs font-medium text-[#707079] shadow-sm">
                Showing&nbsp;
                <span className="text-black">
                    &nbsp;
                    {table.getRowModel().rows.length}
                </span>
                &nbsp;of&nbsp;
                <span className="text-black">{data.length}</span>
                 Entries
            </div>
            <div className="rounded-lg shadow-sm">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: table.getPageCount() },
                            (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href="#"
                                        isActive={
                                            index ===
                                            table.getState().pagination
                                                .pageIndex
                                        }
                                        onClick={() =>
                                            table.setPageIndex(index)
                                        }
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                href="#"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
