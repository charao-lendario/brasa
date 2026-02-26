import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useFilteredData } from '../../hooks/useFilteredData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Contract } from '../../types';

const col = createColumnHelper<Contract>();

const columns = [
  col.accessor('date', {
    header: 'Data',
    cell: info => formatDate(info.getValue()),
  }),
  col.accessor('clientName', {
    header: 'Cliente',
    cell: info => <span className="text-white">{info.getValue()}</span>,
  }),
  col.accessor('broker', {
    header: 'Corretor',
    cell: info => <span className="text-white font-medium">{info.getValue()}</span>,
  }),
  col.accessor('empreendimento', {
    header: 'Empreendimento',
  }),
  col.accessor('imovel', {
    header: 'Imovel',
    cell: info => <span className="max-w-[200px] truncate block">{info.getValue()}</span>,
  }),
  col.accessor('valor', {
    header: 'Valor',
    cell: info => <span className="text-gold-400">{formatCurrency(info.getValue())}</span>,
  }),
  col.accessor('year', {
    header: 'Ano',
  }),
];

export function AllContractsView() {
  const { contracts } = useFilteredData();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const table = useReactTable({
    data: contracts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const totalValue = useMemo(() => contracts.reduce((s, c) => s + c.valor, 0), [contracts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Todos os Contratos</h2>
        <div className="text-xs text-gray-400">
          {contracts.length} contratos | {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-navy-600">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs text-gray-500 uppercase cursor-pointer hover:text-white transition-colors select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown size={12} className="opacity-50" />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t border-navy-700 hover:bg-navy-700/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2.5 text-gray-400 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-navy-600">
          <span className="text-xs text-gray-500">
            Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded bg-navy-700 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded bg-navy-700 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
