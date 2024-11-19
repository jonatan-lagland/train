"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { TransformedTimeTableRow } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

type MemoizedEmptyRow = {
  columns: ColumnDef<TransformedTimeTableRow>[];
  t: any;
};

const MemoizedEmptyRow = React.memo(({ columns, t }: MemoizedEmptyRow) => (
  <TableRow>
    <TableCell colSpan={columns.length} className="text-center h-32 flex-1">
      {t("Navigation.searchnotfound")}
    </TableCell>
  </TableRow>
));

MemoizedEmptyRow.displayName = "MemoizedEmptyRow";

export default MemoizedEmptyRow;
