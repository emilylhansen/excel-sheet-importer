import { createSelector } from "reselect";
import * as O from "fp-ts/lib/Option";
import * as R from "fp-ts/lib/Record";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { Blob, RootState, ColumnItem, ColumnId } from "./types";

const getBlob = (state: RootState) => state.root.blob;

const getColumnIdsByColumnIndex = (state: RootState) =>
  state.root.columnIdsByColumnIndex;

export const getFirstDataPointRowNumber = (state: RootState) =>
  state.root.firstDataPointRowNumber;

export const getDataHeaderRowRange = (state: RootState) =>
  state.root.dataHeaderRowRange;

export const getBlobForServer = (state: RootState) => state.root.blobForServer;

export const getFilename = createSelector(
  getBlob,
  (blob): O.Option<string> =>
    pipe(
      blob,
      O.map((b) => b.filename)
    )
);

export const getBlobColumnItemsByColumnId = createSelector(
  getBlob,
  (blob): O.Option<Blob["data"]> =>
    pipe(
      blob,
      O.map((b) => b.data)
    )
);

export const getBlobForServerColumnItemsByColumnId = createSelector(
  getBlobForServer,
  (blobForServer): O.Option<Blob["data"]> =>
    pipe(
      blobForServer,
      O.map((b) => b.data)
    )
);

export const getDataRowCount = createSelector(
  getBlobForServerColumnItemsByColumnId,
  getFirstDataPointRowNumber,
  (blobForServerColumnItemsByColumnId, firstDataPointRowNumber): number =>
    pipe(
      blobForServerColumnItemsByColumnId,
      O.map(R.toArray),
      O.chain(A.head),
      O.map(([_, v]) => v.length - firstDataPointRowNumber),
      O.getOrElse(() => 0)
    )
);

export const getMaxDataRowCount = createSelector(
  getBlobForServerColumnItemsByColumnId,
  (blobForServerColumnItemsByColumnId): number =>
    pipe(
      blobForServerColumnItemsByColumnId,
      O.map(R.toArray),
      O.chain(A.head),
      O.map(([_, v]) => v.length),
      O.getOrElse(() => 0)
    )
);

export const getGridRowCount = createSelector(
  getDataRowCount,
  /** add an extra row for the error notifications */
  (dataRowCount): number => dataRowCount + 1
);

export const getColumnCount = createSelector(
  getColumnIdsByColumnIndex,
  (columnIdsByColumnIndex): number => pipe(columnIdsByColumnIndex, R.size)
);

type DataForColumn = { columnId: ColumnId; data: Array<ColumnItem> };
export const getDataForColumnIndex = (columnIndex: number) =>
  createSelector(
    getColumnIdsByColumnIndex,
    getBlobForServerColumnItemsByColumnId,
    getFirstDataPointRowNumber,
    (
      columnIdsByColumnIndex,
      blobForServerColumnItemsByColumnId,
      firstDataPointRowNumber
    ): O.Option<{
      parameter: DataForColumn;
      column: O.Option<DataForColumn>;
    }> => {
      const columnDataO = ({
        columnIdForColumn,
        columnDataByColumnId_
      }: {
        columnIdForColumn: O.Option<ColumnId>;
        columnDataByColumnId_: Record<string, Array<ColumnItem>>;
      }): O.Option<DataForColumn> =>
        pipe(
          columnIdForColumn,
          O.chain((ccId) =>
            pipe(
              columnDataByColumnId_,
              /** get the data for the column id */
              R.lookup(ccId),
              O.map((cData) => {
                /** take the data entries from the firstDataPointRowNumber */
                const data = pipe(
                  cData,
                  A.splitAt(firstDataPointRowNumber - 1),
                  ([_, t]) => t
                );

                return {
                  columnId: ccId,
                  data
                };
              })
            )
          )
        );

      const dataForColumnIndex = pipe(
        blobForServerColumnItemsByColumnId,
        O.chain((cItemsById) =>
          pipe(
            /**
             * get the column ids for the parameter and column fields in a column
             */
            columnIdsByColumnIndex[columnIndex],
            O.fromNullable,
            O.chain((cIds) =>
              pipe(
                cItemsById,
                R.lookup(cIds.columnIdForParameter),
                /** get the column data for the paramter field in a column */
                O.map((pData) => ({
                  parameter: {
                    columnId: cIds.columnIdForParameter,
                    data: pData
                  },
                  column: columnDataO({
                    columnIdForColumn: cIds.columnIdForColumn,
                    columnDataByColumnId_: cItemsById
                  })
                }))
              )
            )
          )
        )
      );

      return dataForColumnIndex;
    }
  );

export const getAvailableColumnItemsByColumnId = createSelector(
  getColumnIdsByColumnIndex,
  getBlobColumnItemsByColumnId,
  (columnIdsByColumnIndex, blobColumnItemsByColumnId) => {
    /**
     * find the columnIds that are already selected by other columns
     */
    const takenColumnColumnIds = pipe(
      columnIdsByColumnIndex,
      R.toArray,
      A.map(([_, v]) => v.columnIdForColumn),
      A.compact
    );

    const availableColumnDataByColumnId = pipe(
      blobColumnItemsByColumnId,
      O.map(R.toArray),
      O.map(
        /**
         * find the available columnIds and their data for selection
         */
        A.filter(([k, _]) =>
          pipe(
            takenColumnColumnIds,
            A.findFirst((i) => i === k),
            O.isNone
          )
        )
      ),
      /**
       * convert array back to record
       */
      O.map(
        A.reduce<
          [ColumnId, Array<ColumnItem>],
          Record<ColumnId, Array<ColumnItem>>
        >(R.empty, (acc, [k, v]) => ({
          ...acc,
          [k]: v
        }))
      ),
      O.getOrElse<Record<ColumnId, Array<ColumnItem>>>(() => R.empty)
    );

    return availableColumnDataByColumnId;
  }
);
