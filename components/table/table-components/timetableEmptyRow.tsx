"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { TransformedTimeTableRow } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

type TimetableEmptyRowProps = {
  columns: ColumnDef<TransformedTimeTableRow>[];
  t: any;
};

const TimetableEmptyRow = ({ columns, t }: TimetableEmptyRowProps) => (
  <TableRow>
    <TableCell colSpan={columns.length} className="text-center h-32 flex-1">
      {t("Navigation.searchnotfound")}
    </TableCell>
  </TableRow>
);

export default TimetableEmptyRow;
